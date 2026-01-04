package com.eventwisp.app.service.impl;

import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.entity.EventCategory;
import com.eventwisp.app.repository.EventCategoryRepository;
import com.eventwisp.app.service.EventCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EventCategoryServiceImpl implements EventCategoryService {

    //Create an instance of 'EventCategoryRepository'
    private EventCategoryRepository eventCategoryRepository;

    //Inject an 'EventCategoryRepository'
    @Autowired
    public EventCategoryServiceImpl(EventCategoryRepository eventCategoryRepository){
        this.eventCategoryRepository=eventCategoryRepository;
    }

    //save a new category
    @Override
    public EventCategory addCategory(EventCategory eventCategory) {
        return eventCategoryRepository.save(eventCategory);
    }

    //Get all categories
    @Override
    public MultipleEntityResponse<EventCategory> getAllCategories() {

        MultipleEntityResponse<EventCategory> response=new MultipleEntityResponse<>();

        List<EventCategory> categories=eventCategoryRepository.findAll();

        if(categories.isEmpty()){
          response.setMessage("No categories found");
          response.setRemarks("Category count "+0);
          response.setEntityList(new ArrayList<>());

          return response;
        }

        response.setMessage("Categories List");
        response.setMessage("Category count:"+categories.size());
        response.setEntityList(categories);

        return response;
    }

    //Get a cetegory by id
    @Override
    public EventCategory findCategoryById(Long id) {
        return eventCategoryRepository.findById(id).orElse(null);
    }

    //Update an existing category
    @Override
    public EventCategory updateCategory(Long id, EventCategory updatedEventCategory) {
        //Find existing category
        EventCategory existingCategory=eventCategoryRepository.findById(id).orElse(null);

        //Check if there is an existing category
        if(existingCategory==null){
            return null;
        }

        existingCategory.setCategory(updatedEventCategory.getCategory());

        return eventCategoryRepository.save(existingCategory);
    }

    //Delete a category
    @Override
    public Boolean deleteCategory(Long id) {

        //Check if a category is existing
        boolean isExist=eventCategoryRepository.existsById(id);

        if(isExist){
            eventCategoryRepository.deleteById(id);

            return true;
        }
        return false;
    }
}
