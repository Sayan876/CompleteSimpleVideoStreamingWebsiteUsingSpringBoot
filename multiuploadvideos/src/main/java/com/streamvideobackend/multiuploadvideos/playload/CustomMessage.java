package com.streamvideobackend.multiuploadvideos.playload;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Builder


public class CustomMessage {
   private String message;
   private boolean success = false; 
}
