package com.streamvideobackend.multiuploadvideos.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.streamvideobackend.multiuploadvideos.dto.User;
import com.streamvideobackend.multiuploadvideos.dto.Video;
import com.streamvideobackend.multiuploadvideos.repository.UserRepository;
import com.streamvideobackend.multiuploadvideos.repository.VideoRepository;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VideoService {

//	@PersistenceContext
//    private EntityManager entityManager;

	private final VideoRepository videoRepository;
	private final UserRepository userRepository;

	@Value("${files.video}")
	String DIR;

	@PostConstruct
	public void init() {
		File file = new File(DIR);

		if (!file.exists()) {
			file.mkdir();
			System.out.println("Folder has been creeated!");
		} else {
			System.out.println("Folder already created");
		}
	}

	public Video saveVideo(Video video, MultipartFile file, int id) {
		Optional<User> recUser = userRepository.findById(id);

		try {

			String filename = file.getOriginalFilename();
			String contentType = file.getContentType();
			InputStream inputStream = file.getInputStream();

			String cleanFileName = StringUtils.cleanPath(filename);
			String cleanFolder = StringUtils.cleanPath(DIR);

			Path path = Paths.get(cleanFolder, cleanFileName);
			System.out.println(contentType);
			System.out.println(path);

			Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);

			video.setContentType(contentType);
			video.setFilePath(path.toString());
//			video.setUploadedAt(video.getUploadedAt());
			User dbUser = recUser.get();
			dbUser.getVideos().add(video);
			video.setUser(dbUser);

			return videoRepository.save(video);

		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

//	public Video updateVideoDetails(int id, Video video, String videoId) {
//		Optional<Video> recVideo = videoRepository.findById(videoId);
//		Optional<User> recUser = userRepository.findById(id);
//		if(recVideo.isPresent()) {
//			
//			User dbUser = recUser.get();
//			dbUser.getVideos().add(video);
//			video.setUser(dbUser);
//			
//			return videoRepository.save(video);
//			
//		}else {
//			return null; 
//		}
//	}

	public Video updatetanddec(String title, String description, String vid) {
		Optional<Video> recVideo = videoRepository.findById(vid);
		if (recVideo.isEmpty()) {
			return null;
		} else {
			Video dbvideo = recVideo.get();
			dbvideo.setDescription(description);
			dbvideo.setTitle(title);
			return videoRepository.save(dbvideo);
		}
	}

	public List<Video> getVideosAll() {
		return videoRepository.findAll();
	}

	public Video getVideoById(String id) {
		Video video = videoRepository.findById(id).orElseThrow(() -> new RuntimeException("video not found"));
		return video;
	}

	public List<Video> getVideoByUserIdNumber(int id) {
		List<Video> videos = videoRepository.getVideosByUserId(id);

		return videos;
	}

	public List<Video> getVideosbyEmailandPass(String email, String pass) {
		return videoRepository.getVideosByUserEmailandPassword(email, pass);
	}

//	public void deleteVideoByIdnumber(String videoId) {
//		videoRepository.deleteVideoById(videoId);
//		
//		
//		
//	}

	public boolean deleteVideoById(String videoId) {
		// 1. Find the video by ID
		Optional<Video> recVideo = videoRepository.findById(videoId);
		if (recVideo.isEmpty()) {
			System.out.println("Video not found with ID: " + videoId);
			return false;
		}

		Video video = recVideo.get();

		try {
			// 2. Delete the video file from disk (if it exists)
			String filePath = video.getFilePath();
			if (filePath != null && !filePath.isEmpty()) {
				Path path = Paths.get(filePath);
				if (Files.exists(path)) {
					Files.delete(path);
					System.out.println("Deleted video file: " + path);
				} else {
					System.out.println("Video file not found on disk: " + path);
				}
			}

			// 3. Remove video entry from database
			videoRepository.delete(video);
			System.out.println("Deleted video record from database: " + videoId);

			return true;

		} catch (IOException e) {
			System.err.println("Error deleting video file: " + e.getMessage());
			return false;
		}
	}

	public int getUserIdByVideoId(String videoId) {
		try {
			return videoRepository.findUserIdByVideoId(videoId);
		} catch (Exception e) {
			System.out.println("Error fetching userId for videoId: " + videoId);
			throw e;
		}
	}

	// FETCHIN NEWER TO OLDER
	public List<Video> getAllLatestToNew() {
		return videoRepository.findAllVideosOrderByUploadedAtDesc();
	}

	public List<Video> getVideoByTitle(String title) {
		return videoRepository.getVideosByTitle(title);
	}
	
	public User getUserByVideoId(String videoId) {
		return videoRepository.findUserByVideoId(videoId);
	}

}
