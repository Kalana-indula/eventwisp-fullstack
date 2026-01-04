package com.eventwisp.app.service;

import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.entity.EventCategory;
import org.springframework.stereotype.Service;

@Service
public interface EventCategoryService {
    EventCategory addCategory(EventCategory eventCategory);

    MultipleEntityResponse<EventCategory> getAllCategories();

    EventCategory findCategoryById(Long id);

    EventCategory updateCategory(Long id, EventCategory updatedEventCategory);

    Boolean deleteCategory(Long id);
}
