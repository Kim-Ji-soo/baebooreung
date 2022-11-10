package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.domain.Navigation;
import com.pro.baebooreung.businessservice.domain.repository.NavigationRepository;
import com.pro.baebooreung.businessservice.dto.NavigationDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@Transactional
public class NavigationServiceImpl implements NavigationService {

    private NavigationRepository navigationRepository;
    @PersistenceContext
    private final EntityManager em;

    @Autowired
    public NavigationServiceImpl(NavigationRepository navigationRepository, EntityManager em){
        this.navigationRepository = navigationRepository;
        this.em = em;
    }
    @Override
    public void saveNavigationGps(int route_id, List<NavigationDto> path) throws Exception {
        path.forEach(navigationDto -> {
            Navigation navigation = new Navigation();
            navigation.saveNavigation(route_id, navigationDto.getLatitude(), navigationDto.getLongitude());
            navigationRepository.save(navigation);
        });
    }

    @Override
    public List<NavigationDto> getNavigationGpsByRouteId(int route_id) throws Exception {
        Iterable<Navigation> navigationEntityList = navigationRepository.findByRouteId(route_id);// userId로 route 리스트 찾기
        List<NavigationDto> responseNavigations = new ArrayList<>();

        navigationEntityList.forEach(navigation -> {
            responseNavigations.add(NavigationDto.builder()
                    .latitude(navigation.getLatitude())
                    .longitude(navigation.getLongitude())
                    .build());
        });
        return responseNavigations;
    }
}
