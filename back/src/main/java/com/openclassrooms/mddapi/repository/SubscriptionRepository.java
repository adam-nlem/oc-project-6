package com.openclassrooms.mddapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUser(User user);
    
    List<Subscription> findByTopic(Topic topic);
    
    Optional<Subscription> findByUserAndTopic(User user, Topic topic);
    
    boolean existsByUserAndTopic(User user, Topic topic);
    
    void deleteByUserAndTopic(User user, Topic topic);
}
