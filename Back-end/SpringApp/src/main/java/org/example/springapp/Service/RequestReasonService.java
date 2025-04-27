package org.example.springapp.Service;

import org.example.springapp.DTO.RequestReasonDTO;
import org.example.springapp.Repository.RequestReasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestReasonService {
    @Autowired
    private RequestReasonRepository requestReasonRepository;

    @Cacheable(value = "requestReason", key = "'reasons'")
    public List<RequestReasonDTO> reasons() {
        return requestReasonRepository.findAll().stream().map(s-> new RequestReasonDTO(
                s.getId(), s.getReason()
        )).collect(Collectors.toList());
    }
}
