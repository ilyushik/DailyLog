package org.example.springapp.Repository;

import org.example.springapp.Model.Request;
import org.example.springapp.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {
    List<Request> findAllByUserId(int id);

    List<Request> findAllByUniqueCode(String uniqueCode);
}
