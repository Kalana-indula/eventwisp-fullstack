package com.eventwisp.app.controller;

import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.entity.EventCategory;
import com.eventwisp.app.service.EventCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EventCategoryController {

    //Create a 'EventCategoryService' instance
    private EventCategoryService eventCategoryService;

    //Inject a 'EventCategoryService'
    @Autowired
    public EventCategoryController(EventCategoryService eventCategoryService){
        this.eventCategoryService=eventCategoryService;
    }

    //Create a new category
    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody EventCategory eventCategory){
        try{
            EventCategory category=eventCategoryService.addCategory(eventCategory);

            return ResponseEntity.status(HttpStatus.OK).body(category);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //Find all categories
    @GetMapping("categories")
    public ResponseEntity<?> getAllCategories(){
        try{
            MultipleEntityResponse<EventCategory> response=eventCategoryService.getAllCategories();

            return ResponseEntity.status(HttpStatus.OK).body(response);

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //Find category by id
    @GetMapping("/categories/{id}")
    public ResponseEntity<?> findCategoryById(@PathVariable Long id){
        try{
            EventCategory existingCategory= eventCategoryService.findCategoryById(id);

            if(existingCategory==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No categories found for corresponding id");
            }

            return ResponseEntity.status(HttpStatus.OK).body(existingCategory);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }

    //Update an existing category
    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id,@RequestBody EventCategory categoryUpdate){
        try {
            EventCategory updatedCategory= eventCategoryService.updateCategory(id,categoryUpdate);
            //Check if updated category is null
            if(updatedCategory==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No categories found for corresponding id");
            }
            return ResponseEntity.status(HttpStatus.OK).body(updatedCategory);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //Delete a category
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id){
        try{
            //Check if deleted
            boolean isDeleted= eventCategoryService.deleteCategory(id);

            if(!isDeleted){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No categories found for corresponding id");
            }

            return ResponseEntity.status(HttpStatus.OK).body("Category deleted successfully");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
