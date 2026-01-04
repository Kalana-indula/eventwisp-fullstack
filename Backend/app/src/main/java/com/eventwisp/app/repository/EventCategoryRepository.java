package com.eventwisp.app.repository;

import com.eventwisp.app.entity.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventCategoryRepository extends JpaRepository<EventCategory,Long> {

    //check if category exists
    boolean existsByCategory(String categoryName);

    //find category by category name
    EventCategory findByCategory(String categoryName);
}
