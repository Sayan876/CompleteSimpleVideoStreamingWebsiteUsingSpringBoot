package com.streamvideobackend.multiuploadvideos.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="user")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id; 
	private String name; 
	private String password; 
	private String profilePicPath;
	private String biodetails;
	private String country;
	
	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime accountCreatedAt;
	@Column(unique = true)
	private String email;
	
	@OneToMany(mappedBy = "user" , orphanRemoval = true)
	private List<Video> videos;
   

}
