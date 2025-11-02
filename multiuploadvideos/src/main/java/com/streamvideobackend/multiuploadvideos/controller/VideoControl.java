package com.streamvideobackend.multiuploadvideos.controller;

import java.util.List;
import java.util.UUID;

import javax.net.ssl.SSLEngineResult.Status;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.streamvideobackend.multiuploadvideos.dto.User;
import com.streamvideobackend.multiuploadvideos.dto.Video;
import com.streamvideobackend.multiuploadvideos.playload.CustomMessage;
import com.streamvideobackend.multiuploadvideos.service.VideoService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v3/videos")
@CrossOrigin
@RequiredArgsConstructor

public class VideoControl {

	private final VideoService videoService;

	@PostMapping("/{id}")
	public ResponseEntity<?> create(@RequestParam("file") MultipartFile file, @RequestParam("title") String title,
			@RequestParam("description") String description, @PathVariable int id) {

		Video video = new Video();

		video.setTitle(title);
		video.setDescription(description);
		video.setVideoId(UUID.randomUUID().toString());

		Video savedVideo = videoService.saveVideo(video, file, id);

		if (savedVideo != null) {
			return ResponseEntity.status(HttpStatus.OK).body(video);
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(CustomMessage.builder().message("Video not Uploaded").success(false).build());
		}

	}

	@PatchMapping("/{id}")
	public ResponseEntity<?> updateUser(@PathVariable String id, @RequestParam("title") String title,
			@RequestParam("description") String description) {

		try {
			Video video = videoService.updatetanddec(title, description, id);
			return ResponseEntity.ok(video);

		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}

	}

	// Streaming video
	@GetMapping("/stream/{videoId}")
	public ResponseEntity<Resource> stream(@PathVariable String videoId) {
		Video video = videoService.getVideoById(videoId);
		String contentType = video.getContentType();
		String filePath = video.getFilePath();

		Resource resource = new FileSystemResource(filePath);

		if (contentType == null) {
			contentType = "application/octet-type";
		}

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
	}

	@GetMapping("/byUserId/{id}")
	public List<Video> getVideosByPersonId(@PathVariable int id) {
		return videoService.getVideoByUserIdNumber(id);
	}

	@PostMapping("/verifyep")
	public ResponseEntity<List<Video>> verifiyByEmailandPass(@RequestParam("email") String email,
			@RequestParam("password") String password) {
		List<Video> result = videoService.getVideosbyEmailandPass(email, password);
		System.out.println(email);
		System.out.println(password);
		if (result == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.status(HttpStatus.OK).body(result);
		}
	}

	@GetMapping
	public ResponseEntity<List<Video>> showAllVideos() {
		List<Video> listVideos = videoService.getAllLatestToNew();
		if (listVideos == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.status(HttpStatus.OK).body(listVideos);
		}
	}
	
	@GetMapping("/searchByTitle/{title}")
    public ResponseEntity<List<Video>> showVideoByTitle(@PathVariable String title){
    	List<Video> videos = videoService.getVideoByTitle(title);
    	if(videos == null) {
    		return ResponseEntity.notFound().build();
    	}else {
    		return ResponseEntity.status(HttpStatus.OK).body(videos);
    	}
    }

	@DeleteMapping("/{videoId}")
	public ResponseEntity<String> deleteVideo(@PathVariable String videoId) {
		boolean deleted = videoService.deleteVideoById(videoId);
		if (deleted) {
			return ResponseEntity.ok("Video deleted successfully");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video not found or could not be deleted");
		}
	}
	
	
	@GetMapping("/getUserIdByVideoId/{videoId}")
	public int getUserIdByVideoId(@PathVariable String videoId) {
        return videoService.getUserIdByVideoId(videoId);
    }
	
	//Fetching the user by video Id 
	
	@GetMapping("/getUserByVideo/{videoId}")
	public User findUserByVideo(@PathVariable String videoId) {
		return videoService.getUserByVideoId(videoId);
	}

}
