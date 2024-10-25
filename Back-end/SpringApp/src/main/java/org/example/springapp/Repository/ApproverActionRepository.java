package org.example.springapp.Repository;

import org.example.springapp.Model.ApproverAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApproverActionRepository extends JpaRepository<ApproverAction, Integer> {
    public ApproverAction findApproverActionByAction(String actionName);
}
