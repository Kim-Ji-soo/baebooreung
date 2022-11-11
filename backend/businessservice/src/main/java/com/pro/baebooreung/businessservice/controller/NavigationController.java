package com.pro.baebooreung.businessservice.controller;

import com.pro.baebooreung.businessservice.domain.Navigation;
import com.pro.baebooreung.businessservice.dto.NavigationDto;
import com.pro.baebooreung.businessservice.dto.NavigationRequestDto;
import com.pro.baebooreung.businessservice.service.NavigationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NavigationController {

    NavigationService navigationService;

    @Autowired
    public NavigationController(NavigationService navigationService){
        this.navigationService = navigationService;
    }

    @GetMapping("/navigps/{routeId}")
    public ResponseEntity<?> getNavigationGps(@PathVariable int routeId){
        try {
            List<NavigationDto> path = navigationService.getNavigationGpsByRouteId(routeId);
            return new ResponseEntity<>(path, HttpStatus.OK);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>("SERVER ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/navigps/{routeId}")
    public ResponseEntity<?> saveNavigationGps(@PathVariable("routeId") int routeId, @RequestBody NavigationRequestDto requestDto){
        try {
            navigationService.saveNavigationGps(routeId, requestDto.getList());
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>("SERVER ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
