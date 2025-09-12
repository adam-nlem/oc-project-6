package com.openclassrooms.mddapi.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUser(User user);
    
    List<Post> findByTopic(Topic topic);
    
    Page<Post> findByTopic(Topic topic, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.topic IN :topics ORDER BY p.createdAt DESC")
    Page<Post> findByTopicsOrderByCreatedAtDesc(@Param("topics") List<Topic> topics, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.topic IN :topics ORDER BY p.createdAt ASC")
    Page<Post> findByTopicsOrderByCreatedAtAsc(@Param("topics") List<Topic> topics, Pageable pageable);
}
