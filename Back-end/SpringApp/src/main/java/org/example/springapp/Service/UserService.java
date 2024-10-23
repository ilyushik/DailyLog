package org.example.springapp.Service;

import org.example.springapp.DTO.UserDTO;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<UserDTO> users() {
        return userRepository.findAll().stream().map(s -> new UserDTO(
                s.getId(), s.getFirstName(), s.getSecondName(), s.getEmail(), s.getPassword(),
                s.getImage(), s.getJobPosition(), s.getRole().getRole()
        )).collect(Collectors.toList());
    }

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


}
