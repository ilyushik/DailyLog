package org.example.springapp.Service;

import org.example.springapp.DTO.UserDTO;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.util.CustomObjectMappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        return customObjectMappers.userToDto(user);
    }

    @Cacheable(value = "user", unless = "#result == null", key = "'username=' + #username")
    public UserDTO userByUsername(String username) {
        String[] name = username.split(" ");
        User user = userRepository.findUserByFirstNameAndSecondName(name[0], name[1]);
        return customObjectMappers.userToDto(user);
    }

    @Cacheable(value = "usersByLead", unless = "#result == null", key = "'leadId=' + #id")
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
        return usersByL.stream().map(u -> customObjectMappers.userToDto(u)).collect(Collectors.toList());
    }

    // set 2 days to skip for every month
    @Transactional
    @Scheduled(cron = "0 0 0 1 * *")
    public void setDaysToSkip() {
        List<User> users = userRepository.findAll();
        users.forEach(u -> u.setDaysToSkip(2));
        userRepository.saveAll(users);
    }

}
