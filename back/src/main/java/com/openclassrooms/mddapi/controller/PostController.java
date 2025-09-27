package com.openclassrooms.mddapi.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.payload.request.CommentRequest;
import com.openclassrooms.mddapi.payload.request.PostRequest;
import com.openclassrooms.mddapi.payload.response.CommentResponse;
import com.openclassrooms.mddapi.payload.response.MessageResponse;
import com.openclassrooms.mddapi.payload.response.PostResponse;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "desc") String sort) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Subscription> subscriptions = subscriptionRepository.findByUser(user);
        
        if (subscriptions.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        List<Topic> subscribedTopics = subscriptions.stream()
                .map(Subscription::getTopic)
                .collect(Collectors.toList());

        Pageable pageable = PageRequest.of(page, size);
        Page<Post> postPage;

        if ("asc".equalsIgnoreCase(sort)) {
            postPage = postRepository.findByTopicsOrderByCreatedAtAsc(subscribedTopics, pageable);
        } else {
            postPage = postRepository.findByTopicsOrderByCreatedAtDesc(subscribedTopics, pageable);
        }

        List<PostResponse> postResponses = postPage.getContent().stream()
                .map(post -> new PostResponse(
                        post.getId(),
                        post.getTitle(),
                        post.getContent(),
                        post.getTopic().getId(),
                        post.getTopic().getName(),
                        post.getUser().getId(),
                        post.getUser().getUsername(),
                        post.getCreatedAt(),
                        post.getUpdatedAt()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(postResponses);
    }

    //TODO: Implement view by topics for posts
    @GetMapping("/topic/{topicId}")
    public ResponseEntity<?> getPostsByTopic(
            @PathVariable Long topicId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "desc") String sort) {

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "createdAt"));

        Page<Post> postPage = postRepository.findByTopic(topic, pageable);

        List<PostResponse> postResponses = postPage.getContent().stream()
                .map(post -> new PostResponse(
                        post.getId(),
                        post.getTitle(),
                        post.getContent(),
                        post.getTopic().getId(),
                        post.getTopic().getName(),
                        post.getUser().getId(),
                        post.getUser().getUsername(),
                        post.getCreatedAt(),
                        post.getUpdatedAt()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(postResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(@PathVariable Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<Comment> comments = commentRepository.findByPostOrderByCreatedAtAsc(post);

        List<CommentResponse> commentResponses = comments.stream()
                .map(comment -> new CommentResponse(
                        comment.getId(),
                        comment.getContent(),
                        comment.getPost().getId(),
                        comment.getUser().getId(),
                        comment.getUser().getUsername(),
                        comment.getCreatedAt()))
                .collect(Collectors.toList());

        PostResponse postResponse = new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getTopic().getId(),
                post.getTopic().getName(),
                post.getUser().getId(),
                post.getUser().getUsername(),
                post.getCreatedAt(),
                post.getUpdatedAt());

        postResponse.setComments(commentResponses);

        return ResponseEntity.ok(postResponse);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createPost(@Valid @RequestBody PostRequest postRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Topic topic = topicRepository.findById(postRequest.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setUser(user);
        post.setTopic(topic);

        Post savedPost = postRepository.save(post);

        PostResponse postResponse = new PostResponse(
                savedPost.getId(),
                savedPost.getTitle(),
                savedPost.getContent(),
                savedPost.getTopic().getId(),
                savedPost.getTopic().getName(),
                savedPost.getUser().getId(),
                savedPost.getUser().getUsername(),
                savedPost.getCreatedAt(),
                savedPost.getUpdatedAt());

        return ResponseEntity.status(HttpStatus.CREATED).body(postResponse);
    }

    @PostMapping("/{postId}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest commentRequest) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setContent(commentRequest.getContent());
        comment.setUser(user);
        comment.setPost(post);

        Comment savedComment = commentRepository.save(comment);

        CommentResponse commentResponse = new CommentResponse(
                savedComment.getId(),
                savedComment.getContent(),
                savedComment.getPost().getId(),
                savedComment.getUser().getId(),
                savedComment.getUser().getUsername(),
                savedComment.getCreatedAt());

        return ResponseEntity.status(HttpStatus.CREATED).body(commentResponse);
    }

    //TODO: Implement post deletion in future versions
    @DeleteMapping("/{postId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if the current user is the author of the post
        if (!post.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: You can only delete your own posts!"));
        }

        // Delete all comments associated with the post
        List<Comment> comments = commentRepository.findByPost(post);
        commentRepository.deleteAll(comments);

        // Delete the post
        postRepository.delete(post);

        return ResponseEntity.ok(new MessageResponse("Post deleted successfully!"));
    }

    //TODO: Implement comment deletion in future versions
    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Check if the current user is the author of the comment
        if (!comment.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: You can only delete your own comments!"));
        }

        commentRepository.delete(comment);

        return ResponseEntity.ok(new MessageResponse("Comment deleted successfully!"));
    }
}
