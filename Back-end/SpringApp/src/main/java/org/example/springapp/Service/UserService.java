package org.example.springapp.Service;

import org.example.springapp.DTO.UserDTO;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.util.CustomObjectMappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomObjectMappers customObjectMappers;

    @Cacheable(value = "user", key = "'email-' + #email")
    public UserDTO userByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return null;
        }

        return customObjectMappers.userToDto(user);
    }

    public List<UserDTO> users() {
        return userRepository.findAll().stream().map(u ->
                customObjectMappers.userToDto(u)).collect(Collectors.toList());
    }

    @Cacheable(value = "user", key = "'userId=' + #id")
    public UserDTO userById(int id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }
        UserDTO userDto = new UserDTO(user.getId(), user.getFirstName(), user.getSecondName(),
                user.getEmail(), user.getPassword(), user.getImage(), user.getJobPosition(),
                user.getRole().getRole());

        return userDto;
    }

    @Cacheable(value = "usersByLead", key = "'leadId=' + #id")
    public List<UserDTO> usersByLead(int id) {
        User lead = userRepository.findById(id).orElse(null);
        List<User> usersByL = new ArrayList<>();

        if (lead.getRole().getRole().equals("ROLE_CEO")) {
            for (User u : userRepository.findAll()) {
                if (u.getRole().getRole().equals("ROLE_CEO")) {
                    continue;
                }
                usersByL.add(u);
            }
        } else {
            for (User u : userRepository.findAll()) {
                if (u.getId() == id || u.getRole().getRole().equals("ROLE_CEO")) {
                    continue;
                }
                else {
                    if (u.getTeamLead() != null && u.getTeamLead().getId() == lead.getId()) {
                        usersByL.add(u);
                    } else if (u.getTechLead() != null && u.getTechLead().getId() == lead.getId()) {
                        usersByL.add(u);
                    } else if (u.getPm() != null && u.getPm().getId() == lead.getId()) {
                        usersByL.add(u);
                    } else {
                        continue;
                    }
                }
            }
        }

        // Convert the list of Users to UserDTOs and return
        return usersByL.stream().map(u -> new UserDTO(
                u.getId(), u.getFirstName(), u.getSecondName(), u.getEmail(), u.getPassword(), u.getImage(),
                u.getJobPosition(), u.getRole().getRole()
        )).collect(Collectors.toList());
    }

}
