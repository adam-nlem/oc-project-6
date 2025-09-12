package com.openclassrooms.mddapi.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class PostRequest {
    @NotNull
    private Long topicId;
    
    @NotBlank
    @Size(min = 3, max = 100)
    private String title;
    
    @NotBlank
    @Size(min = 10, max = 5000)
    private String content;

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
