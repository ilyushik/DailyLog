package org.example.springapp.Repository;

import org.example.springapp.Model.RequestReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestReasonRepository extends JpaRepository<RequestReason, Integer> {
    public RequestReason findByReason(String reason);
}
