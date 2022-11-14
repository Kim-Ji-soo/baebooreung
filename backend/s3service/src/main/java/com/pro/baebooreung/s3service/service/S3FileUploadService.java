package com.pro.baebooreung.s3service.service;

import com.amazonaws.AmazonClientException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.Upload;
import com.pro.baebooreung.s3service.dto.ProfileRequest;
import com.pro.baebooreung.s3service.dto.ProfileResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3FileUploadService {

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    public String bucket;

    public ProfileResponse uploadFile(ProfileRequest profileReq) throws IOException {

        ProfileResponse profileRes = new ProfileResponse();

        int currentUserId = profileReq.getUserId();
        MultipartFile curImage = profileReq.getImage();

        String originalName = LocalDate.now() + "/" + currentUserId + "/" + createFileName(curImage.getOriginalFilename());
        long size = curImage.getSize();

        ObjectMetadata objectMetaData = new ObjectMetadata();
        objectMetaData.setContentType(curImage.getContentType());
        objectMetaData.setContentLength(size);

        amazonS3Client.putObject(
                new PutObjectRequest(bucket, originalName, curImage.getInputStream(), objectMetaData)
                        .withCannedAcl(CannedAccessControlList.PublicRead)
        );

        String imagePath = amazonS3Client.getUrl(bucket, originalName).toString();

        profileRes.setProfileUrl(imagePath);
        profileRes.setUserId(currentUserId);

        return profileRes;
    }

    private String createFileName(String fileName) {
        return UUID.randomUUID().toString().concat(getFileExtension(fileName));
    }

    private String getFileExtension(String fileName) {
        try {
            return fileName.substring(fileName.lastIndexOf("."));
        } catch (StringIndexOutOfBoundsException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 형식의 파일 : " + fileName);
        }
    }

}