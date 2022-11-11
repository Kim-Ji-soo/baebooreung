package com.pro.baebooreung.s3service.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProfileService {

    private final S3FileUploadService s3FileUploadService;

    public ProfileService(S3FileUploadService s3FileUploadService) {
        this.s3FileUploadService = s3FileUploadService;
    }

    public void profileSave(MultipartFile multipartFile) {
    }
}
