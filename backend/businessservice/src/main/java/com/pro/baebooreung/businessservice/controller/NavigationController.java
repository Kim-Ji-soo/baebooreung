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

    @GetMapping("/navigps/{route_id}")
    public ResponseEntity<?> getNavigationGps(@PathVariable int route_id){
        try {
            List<NavigationDto> path = navigationService.getNavigationGpsByRouteId(route_id);
            return new ResponseEntity<>(path, HttpStatus.OK);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>("SERVER ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/navigps/{route_id}")
    public ResponseEntity<?> saveNavigationGps(@PathVariable("route_id") int route_id, @RequestBody NavigationRequestDto requestDto){
        try {
            navigationService.saveNavigationGps(route_id, requestDto.getList());
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>("SERVER ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
