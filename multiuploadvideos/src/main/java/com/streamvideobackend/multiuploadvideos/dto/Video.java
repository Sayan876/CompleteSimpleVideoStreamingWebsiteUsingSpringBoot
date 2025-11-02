package com.streamvideobackend.multiuploadvideos.dto;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "video")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Video {

	@Id
	private String videoId;

	private String title;

	private String description;

	private String contentType;

	private String filePath;
	
	
	
	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "user_id")
	private User user; 
	
	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime uploadedAt;

}
