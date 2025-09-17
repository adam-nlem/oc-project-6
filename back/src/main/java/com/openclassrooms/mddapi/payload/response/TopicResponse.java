package com.openclassrooms.mddapi.payload.response;

public class TopicResponse {
    private Long id;
    private String name;
    private String description;
    private boolean isSubscribed;

    public TopicResponse(Long id, String name, String description, boolean isSubscribed) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isSubscribed = isSubscribed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean getIsSubscribed() {
        return isSubscribed;
    }

    public void setIsSubscribed(boolean isSubscribed) {
        this.isSubscribed = isSubscribed;
    }
}
