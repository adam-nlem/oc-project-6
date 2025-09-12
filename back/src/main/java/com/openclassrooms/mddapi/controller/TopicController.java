package com.openclassrooms.mddapi.controller;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.payload.request.TopicRequest;
import com.openclassrooms.mddapi.payload.response.MessageResponse;
import com.openclassrooms.mddapi.payload.response.TopicResponse;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @GetMapping
    public ResponseEntity<List<TopicResponse>> getAllTopics() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null && authentication.isAuthenticated() && 
                                 !(authentication.getPrincipal().equals("anonymousUser"));
        
        User currentUser = null;
        if (isAuthenticated) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            currentUser = userRepository.findById(userDetails.getId())
                    .orElse(null);
        }
        
        final User user = currentUser;
        
        List<TopicResponse> topics = topicRepository.findAll().stream()
                .map(topic -> {
                    boolean isSubscribed = false;
                    if (user != null) {
                        isSubscribed = subscriptionRepository.existsByUserAndTopic(user, topic);
                    }
                    return new TopicResponse(topic.getId(), topic.getName(), topic.getDescription(), isSubscribed);
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(topics);
    }

    //TODO: No Ui to create a theme
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTopic(@Valid @RequestBody TopicRequest topicRequest) {
        if (topicRepository.existsByName(topicRequest.getName())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Topic name is already taken!"));
        }

        Topic topic = new Topic();
        topic.setName(topicRequest.getName());
        topic.setDescription(topicRequest.getDescription());
        
        topicRepository.save(topic);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new TopicResponse(topic.getId(), topic.getName(), topic.getDescription(), false));
    }

    @PostMapping("/{id}/subscribe")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> subscribeTopic(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        
        if (subscriptionRepository.existsByUserAndTopic(user, topic)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Already subscribed to this topic!"));
        }
        
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setTopic(topic);
        
        subscriptionRepository.save(subscription);
        
        return ResponseEntity.ok(new MessageResponse("Subscribed to topic successfully!"));
    }

    @DeleteMapping("/{id}/unsubscribe")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> unsubscribeTopic(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        
        Subscription subscription = subscriptionRepository.findByUserAndTopic(user, topic)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        subscriptionRepository.delete(subscription);
        
        return ResponseEntity.ok(new MessageResponse("Unsubscribed from topic successfully!"));
    }

    //TODO: Move this in the get ALL with a query param
    @GetMapping("/subscribed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TopicResponse>> getSubscribedTopics() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<TopicResponse> subscribedTopics = subscriptionRepository.findByUser(user).stream()
                .map(subscription -> {
                    Topic topic = subscription.getTopic();
                    return new TopicResponse(topic.getId(), topic.getName(), topic.getDescription(), true);
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(subscribedTopics);
    }
}
