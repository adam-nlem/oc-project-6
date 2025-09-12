package com.openclassrooms.mddapi.payload.response;

import java.util.Set;

public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private Set<Long> subscribedTopicIds;

    public UserProfileResponse(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public UserProfileResponse(Long id, String username, String email, Set<Long> subscribedTopicIds) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.subscribedTopicIds = subscribedTopicIds;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<Long> getSubscribedTopicIds() {
        return subscribedTopicIds;
    }

    public void setSubscribedTopicIds(Set<Long> subscribedTopicIds) {
        this.subscribedTopicIds = subscribedTopicIds;
    }
}
