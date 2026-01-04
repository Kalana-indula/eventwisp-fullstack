package com.eventwisp.app.service.impl;

import com.eventwisp.app.dto.EventDetailsDto;
import com.eventwisp.app.dto.EventDto;
import com.eventwisp.app.dto.EventUpdateDto;
import com.eventwisp.app.dto.event.EventCounts;
import com.eventwisp.app.dto.event.EventStatusDto;
import com.eventwisp.app.dto.response.EventCreateResponse;
import com.eventwisp.app.dto.response.FindEventByOrganizerResponse;
import com.eventwisp.app.dto.response.ManagersEventsResponse;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.response.general.UpdateResponse;
import com.eventwisp.app.entity.*;
import com.eventwisp.app.repository.*;
import com.eventwisp.app.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    //Create an instances of eventRepository and eventCategoryRepository
    private EventRepository eventRepository;

    private EventCategoryRepository eventCategoryRepository;

    private TicketRepository ticketRepository;

    private OrganizerRepository organizerRepository;

    private EventStatusRepository eventStatusRepository;

    private FinancialDataRepository financialDataRepository;

    private MonthlyEarningRepository monthlyEarningRepository;

    private EventSequenceRepository eventSequenceRepository;

    @Autowired
    public EventServiceImpl(EventRepository eventRepository,
                            EventCategoryRepository eventCategoryRepository,
                            TicketRepository ticketRepository,
                            OrganizerRepository organizerRepository,
                            EventStatusRepository eventStatusRepository,
                            FinancialDataRepository financialDataRepository,
                            MonthlyEarningRepository monthlyEarningRepository,
                            EventSequenceRepository eventSequenceRepository) {
        this.eventRepository = eventRepository;
        this.eventCategoryRepository = eventCategoryRepository;
        this.ticketRepository = ticketRepository;
        this.organizerRepository = organizerRepository;
        this.eventStatusRepository = eventStatusRepository;
        this.financialDataRepository = financialDataRepository;
        this.monthlyEarningRepository = monthlyEarningRepository;
        this.eventSequenceRepository = eventSequenceRepository;
    }

    //Create a new event
    @Override
    public EventCreateResponse createEvent(EventDto eventDto) {

        EventCreateResponse response = new EventCreateResponse();

        // find event category
        EventCategory category = eventCategoryRepository.findById(eventDto.getEventCategoryId()).orElse(null);

        // find organizer
        Organizer organizer = organizerRepository.findById(eventDto.getOrganizerId()).orElse(null);

        // find current commission
        FinancialData data = financialDataRepository.findById(1).orElse(null);

        if (data == null) {
            response.setMessage("No commission values are found");
            return response;
        }
        if (category == null) {
            response.setMessage("Invalid Category ");
            return response;
        }
        if (organizer == null) {
            response.setMessage("Invalid organizer");
            return response;
        }

        // Create new 'Event' object
        Event event = new Event();
        event.setEventId(generateEventId());
        event.setEventName(eventDto.getEventName());
        event.setStartingDate(eventDto.getStartingDate());
        event.setDateAdded(LocalDate.now());
        event.setEventCategory(category);
        event.setEventStatus(eventStatusRepository.findById(1L).orElse(null));
        event.setCoverImageLink(eventDto.getCoverImageLink());
        event.setDescription(eventDto.getDescription());
        event.setOrganizer(organizer);
        event.setCommission(data.getCommission());

        //Get ticket types of event
        List<Ticket> ticketTypes = eventDto.getTickets();

        //Create a new list of ticket types
        List<Ticket> ticketTypesList = new ArrayList<>();

        //Iterate through all json objects in DTO
        for (Ticket ticketType : ticketTypes) {
            //Save each ticket object to the database and get a new ticket object
            ticketType.setEvent(event);
            ticketTypesList.add(ticketType);
        }

        //Add ticket types in the new event object
        event.setTickets(ticketTypesList);
        eventRepository.save(event);

        response.setMessage("Event created successfully");
        response.setEvent(event);

        return response;
    }


    //Find all events
    @Override
    public List<Event> getAllEvents() {

        return eventRepository.findAll();
    }

    //event details list for manager dashboard
    @Override
    public ManagersEventsResponse getManagerEventList() {

        //create a response
        ManagersEventsResponse response = new ManagersEventsResponse();

        //get all events
        List<Event> eventsList = eventRepository.findAll();

        if (eventsList.isEmpty()) {
            response.setMessage("No events found");
            return response;
        }

        List<EventDetailsDto> managerSideEvents = new ArrayList<>();

        for (Event event : eventsList) {
            EventDetailsDto eventDetails = new EventDetailsDto();

            eventDetails.setEventId(event.getId());
            eventDetails.setGeneratedId(event.getEventId());
            eventDetails.setEventName(event.getEventName());
            eventDetails.setEventType(event.getEventCategory().getCategory());
            eventDetails.setOrganizer(event.getOrganizer().getFirstName() + " " + event.getOrganizer().getLastName());
            eventDetails.setDateAdded(event.getDateAdded());
            eventDetails.setStatus(event.getEventStatus().getStatusName());

            managerSideEvents.add(eventDetails);
        }

        response.setEventDetails(managerSideEvents);
        response.setMessage("Event details fetched successfully");

        return response;
    }

    @Override
    public Integer getAllOnGoingEventsCount() {
        return eventRepository.findAllOnGoingEvents().size();
    }

    @Override
    public EventCounts getEventCounts(Long organizerId) {

        EventCounts eventCounts = new EventCounts();

        Integer onGoingEventsCount = eventRepository.findOrganizerEventsByStatus(organizerId,3L).size();
        Integer approvedEventsCount = eventRepository.findOrganizerEventsByStatus(organizerId,5L).size();
        Integer disapprovedEventsCount = eventRepository.findOrganizerEventsByStatus(organizerId,2L).size();
        Integer pendingApprovalEventsCount = eventRepository.findOrganizerEventsByStatus(organizerId,1L).size();
        Integer completedEventsCount = eventRepository.findOrganizerEventsByStatus(organizerId,4L).size();
        Integer allEventsCount = eventRepository.eventsByOrganizer(organizerId).size();

        eventCounts.setOnGoingEventsCount(onGoingEventsCount);
        eventCounts.setApprovedEventsCount(approvedEventsCount);
        eventCounts.setDisapprovedEventsCount(disapprovedEventsCount);
        eventCounts.setCompletedEventsCount(completedEventsCount);
        eventCounts.setPendingApprovalEventsCount(pendingApprovalEventsCount);
        eventCounts.setAllEventsCount(allEventsCount);
        return eventCounts;
    }


    @Override
    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    @Override
    public ManagersEventsResponse getEventDetailsById(Long eventId) {
        // Create a response object
        ManagersEventsResponse response = new ManagersEventsResponse();

        // Retrieve event by ID
        Event event = eventRepository.findById(eventId).orElse(null);

        // Check if event exists
        if (event == null) {
            response.setMessage("Event not found");
            return response;
        }

        EventDetailsDto eventDetails = new EventDetailsDto();
        eventDetails.setEventId(event.getId());
        eventDetails.setEventName(event.getEventName());
        eventDetails.setEventType(event.getEventCategory().getCategory());
        eventDetails.setOrganizer(
                event.getOrganizer().getFirstName() + " " + event.getOrganizer().getLastName()
        );
        eventDetails.setDateAdded(event.getDateAdded());
        eventDetails.setStatus(event.getEventStatus().getStatusName());

        // Wrap the single event in a list
        List<EventDetailsDto> eventDetailsList = new ArrayList<>();
        eventDetailsList.add(eventDetails);

        // Populate response
        response.setEventDetails(eventDetailsList);
        response.setMessage("Event details fetched successfully");

        return response;
    }

    //get a single event details
    @Override
    public SingleEntityResponse<EventDetailsDto> getSingleEventById(Long eventId) {

        SingleEntityResponse<EventDetailsDto> response= new SingleEntityResponse<>();

        Event existingEvent = eventRepository.findById(eventId).orElse(null);

        if(existingEvent == null) {
            response.setMessage("Event not found");
            return response;
        }

        EventDetailsDto eventDetails = new EventDetailsDto();

        eventDetails.setEventId(existingEvent.getId());
        eventDetails.setEventName(existingEvent.getEventName());
        eventDetails.setEventType(existingEvent.getEventCategory().getCategory());
        eventDetails.setOrganizer(existingEvent.getOrganizer().getFirstName()+ " " + existingEvent.getOrganizer().getLastName());
        eventDetails.setOrganizerId(existingEvent.getOrganizer().getId());
        eventDetails.setDateAdded(existingEvent.getDateAdded());
        eventDetails.setStartingDate(existingEvent.getStartingDate());
        eventDetails.setDateCompleted(existingEvent.getDateCompleted());
        eventDetails.setCoverImageLink(existingEvent.getCoverImageLink());
        eventDetails.setEventDescription(existingEvent.getDescription());
        eventDetails.setIsApproved(existingEvent.getIsApproved());
        eventDetails.setIsStarted(existingEvent.getIsStarted());
        eventDetails.setIsCompleted(existingEvent.getIsCompleted());
        eventDetails.setIsPublished(existingEvent.getIsPublished());
        eventDetails.setIsDisapproved(existingEvent.getIsDisapproved());
        eventDetails.setStatus(existingEvent.getEventStatus().getStatusName());
        eventDetails.setCommission(existingEvent.getCommission());
        eventDetails.setTotalAttendeesCount(existingEvent.getTotalAttendeesCount());
        eventDetails.setEarningsByEvent(existingEvent.getEarningsByEvent());
        eventDetails.setTotalProfit(existingEvent.getTotalProfit());

        response.setMessage("Event details fetched successfully");
        response.setEntityData(eventDetails);

        return response;
    }

    @Override
    public SingleEntityResponse<EventDetailsDto> getSingleEventByEventId(String eventId) {

        SingleEntityResponse<EventDetailsDto> response = new SingleEntityResponse<>();

        Event existingEvent = eventRepository.findByEventId(eventId);

        if (existingEvent == null) {
            response.setMessage("Event not found");
            return response;
        }

        EventDetailsDto eventDetails = new EventDetailsDto();

        eventDetails.setEventId(existingEvent.getId());
        eventDetails.setGeneratedId(existingEvent.getEventId());
        eventDetails.setEventName(existingEvent.getEventName());
        eventDetails.setEventType(existingEvent.getEventCategory().getCategory());
        eventDetails.setOrganizer(existingEvent.getOrganizer().getFirstName() + " " + existingEvent.getOrganizer().getLastName());
        eventDetails.setOrganizerId(existingEvent.getOrganizer().getId());
        eventDetails.setDateAdded(existingEvent.getDateAdded());
        eventDetails.setStartingDate(existingEvent.getStartingDate());
        eventDetails.setDateCompleted(existingEvent.getDateCompleted());
        eventDetails.setCoverImageLink(existingEvent.getCoverImageLink());
        eventDetails.setEventDescription(existingEvent.getDescription());
        eventDetails.setIsApproved(existingEvent.getIsApproved());
        eventDetails.setIsStarted(existingEvent.getIsStarted());
        eventDetails.setIsCompleted(existingEvent.getIsCompleted());
        eventDetails.setIsPublished(existingEvent.getIsPublished());
        eventDetails.setIsDisapproved(existingEvent.getIsDisapproved());
        eventDetails.setStatus(existingEvent.getEventStatus().getStatusName());
        eventDetails.setCommission(existingEvent.getCommission());
        eventDetails.setTotalAttendeesCount(existingEvent.getTotalAttendeesCount());
        eventDetails.setEarningsByEvent(existingEvent.getEarningsByEvent());
        eventDetails.setTotalProfit(existingEvent.getTotalProfit());

        response.setMessage("Event details fetched successfully");
        response.setEntityData(eventDetails);

        return response;
    }


    @Override
    public MultipleEntityResponse<EventDetailsDto> getEventsByStatus(Integer statusId) {

        MultipleEntityResponse<EventDetailsDto> response= new MultipleEntityResponse<>();

        //validate status
        boolean isExist=eventStatusRepository.existsById(statusId.longValue());

        if (!isExist) {
            response.setMessage("Event status not found");
            response.setEntityList(new ArrayList<>());
            return response;
        }

        List<Event> eventsList= eventRepository.findEventByStatus(Long.valueOf(statusId));

        if (eventsList.isEmpty()) {
            response.setMessage("No events found");
            response.setRemarks("0");
            response.setEntityList(new ArrayList<>());
            return response;
        }

        List<EventDetailsDto> managerSideEvents = new ArrayList<>();

        for (Event event : eventsList) {
            EventDetailsDto eventDetails = new EventDetailsDto();

            eventDetails.setEventId(event.getId());
            eventDetails.setGeneratedId(event.getEventId());
            eventDetails.setEventName(event.getEventName());
            eventDetails.setEventType(event.getEventCategory().getCategory());
            eventDetails.setOrganizer(event.getOrganizer().getFirstName() + " " + event.getOrganizer().getLastName());
            eventDetails.setDateAdded(event.getDateAdded());
            eventDetails.setDateCompleted(event.getDateCompleted());
            eventDetails.setStartingDate(event.getStartingDate());
            eventDetails.setStatus(event.getEventStatus().getStatusName());

            managerSideEvents.add(eventDetails);
        }

        response.setEntityList(managerSideEvents);
        response.setRemarks(String.valueOf(eventsList.size()));
        response.setMessage("Event details fetched successfully");

        return response;
    }

    //Find event by organizer
    @Override
    public FindEventByOrganizerResponse findEventByOrganizer(Long organizerId) {

        FindEventByOrganizerResponse response = new FindEventByOrganizerResponse();

        // Check if organizer exists
        boolean isExist = organizerRepository.existsById(organizerId);

        if (!isExist) {
            response.setMessage("No organizer found for entered id");
            return response;
        }

        //find organizer details
        Organizer existingOrganizer = organizerRepository.findById(organizerId).orElse(null);

        // Find all events by organizer
        List<Event> eventList = eventRepository.eventsByOrganizer(organizerId);

        if (eventList.isEmpty()) {
            response.setMessage("No events found for the organizer");
            return response;
        }

        // Map all events
        List<EventDetailsDto> allEvents = eventList.stream()
                .map(this::mapToDto)
                .toList();

        // Query and map each category
        List<EventDetailsDto> onGoingEventDetails = eventRepository.findOrganizerEventsByStatus(organizerId, 3L)
                .stream()
                .map(this::mapToDto)
                .toList();

        List<EventDetailsDto> approvedEventDetails = eventRepository.findOrganizerEventsByStatus(organizerId, 5L)
                .stream()
                .map(this::mapToDto)
                .toList();

        List<EventDetailsDto> disapprovedEventDetails = eventRepository.findOrganizerEventsByStatus(organizerId, 2L)
                .stream()
                .map(this::mapToDto)
                .toList();

        List<EventDetailsDto> pendingApprovalEventDetails = eventRepository.findOrganizerEventsByStatus(organizerId, 1L)
                .stream()
                .map(this::mapToDto)
                .toList();

        List<EventDetailsDto> completedEventDetails = eventRepository.findOrganizerEventsByStatus(organizerId, 4L)
                .stream()
                .map(this::mapToDto)
                .toList();

        // Set response
        response.setMessage("Events List");
        response.setTotalEarnings(existingOrganizer.getTotalEarnings());
        response.setAllEvents(allEvents);
        response.setOnGoingEvents(onGoingEventDetails);
        response.setApprovedEvents(approvedEventDetails);
        response.setDisapprovedEvents(disapprovedEventDetails);
        response.setPendingApprovalEvents(pendingApprovalEventDetails);
        response.setCompletedEvents(completedEventDetails);

        return response;
    }

    //find event details by category
    @Override
    public MultipleEntityResponse<EventDetailsDto> findUpCommingEventsByCategory(String categoryName) {

        MultipleEntityResponse<EventDetailsDto> response = new MultipleEntityResponse<>();

        // Check if category exists (derived method)
        boolean categoryExists = eventCategoryRepository.existsByCategory(categoryName);
        if (!categoryExists) {
            response.setMessage("Category not found: " + categoryName);
            return response;
        }

        //find category details
        EventCategory existingCategory=eventCategoryRepository.findByCategory(categoryName);


        // Fetch events
        List<Event> eventsList = eventRepository.findUpComingEventsByCategory(categoryName);

        // Check if events were found
        if (eventsList.isEmpty()) {
            response.setMessage("No events found for category: " + categoryName);
            response.setRemarks(existingCategory.getCategory());
            return response;
        }

        // Convert Event entities to EventDetailsDto objects using the helper method
        List<EventDetailsDto> eventDetails = eventsList.stream()
                .map(this::mapToDto)
                .toList();

        response.setEntityList(eventDetails);
        response.setMessage("Events found for category: " + categoryName);
        response.setRemarks(existingCategory.getCategory());

        return response;
    }

    @Override
    public SingleEntityResponse<EventStatusDto> setEventPublic(Long eventId) {

        SingleEntityResponse<EventStatusDto> response = new SingleEntityResponse<>();

        //Find event
        Event existingEvent=eventRepository.findById(eventId).orElse(null);

        if(existingEvent==null) {
            response.setMessage("No event found for id " + eventId);
            return response;
        }

        EventStatusDto eventStatusDto = new EventStatusDto();

        existingEvent.setIsPublished(true);

        //update event
        Event updatedEvent = eventRepository.save(existingEvent);

        eventStatusDto.setIsPublic(updatedEvent.getIsPublished());
        eventStatusDto.setIsCompleted(updatedEvent.getIsCompleted());
        eventStatusDto.setIsApproved(updatedEvent.getIsApproved());
        eventStatusDto.setIsDisapproved(updatedEvent.getIsDisapproved());
        eventStatusDto.setIsStarted(updatedEvent.getIsStarted());

        response.setMessage("Event is set as public");
        response.setEntityData(eventStatusDto);

        return response;
    }

    // Helper method to convert Event -> EventDetailsDto
    private EventDetailsDto mapToDto(Event event) {
        EventDetailsDto dto = new EventDetailsDto();
        dto.setEventId(event.getId());
        dto.setGeneratedId(event.getEventId());
        dto.setEventName(event.getEventName());
        dto.setEventType(event.getEventCategory().getCategory());
        dto.setOrganizer(event.getOrganizer().getFirstName() + " " + event.getOrganizer().getLastName());
        dto.setOrganizerId(event.getOrganizer().getId());
        dto.setDateAdded(event.getDateAdded());
        dto.setDateCompleted(event.getDateCompleted());
        dto.setStartingDate(event.getStartingDate());
        dto.setCoverImageLink(event.getCoverImageLink());
        dto.setEventDescription(event.getDescription());
        dto.setIsApproved(event.getIsApproved());
        dto.setIsStarted(event.getIsStarted());
        dto.setIsCompleted(event.getIsCompleted());
        dto.setIsDisapproved(event.getIsDisapproved());
        dto.setIsPublished(event.getIsPublished());
        dto.setStatus(event.getEventStatus().getStatusName());
        dto.setEarningsByEvent(event.getEarningsByEvent());
        dto.setTotalProfit(event.getTotalProfit());
        dto.setCommission(event.getCommission());
        dto.setTotalAttendeesCount(event.getTotalAttendeesCount());

        return dto;
    }


    //Update event
    @Override
    public Event updateEvent(Long id, EventUpdateDto eventUpdateDto) {
        //Find existing event
        Event existingEvent = eventRepository.findById(id).orElse(null);

        //check if existing event is null
        if (existingEvent == null) {
            return null;
        }

        //Get current values
        LocalDate currentStartingDate = existingEvent.getStartingDate();
        String currentImageLink = existingEvent.getCoverImageLink();
        String currentDescription = existingEvent.getDescription();

        //Check if dto has a new starting date
        if (eventUpdateDto.getStartingDate() == null) {
            existingEvent.setStartingDate(currentStartingDate);
        } else {
            existingEvent.setStartingDate(eventUpdateDto.getStartingDate());
        }

        //Check if dto has a new image link
        if (eventUpdateDto.getCoverImageLink() == null) {
            existingEvent.setCoverImageLink(currentImageLink);
        } else {
            existingEvent.setCoverImageLink(eventUpdateDto.getCoverImageLink());
        }

        //Check if dto has a new description
        if (eventUpdateDto.getDescription() == null) {
            existingEvent.setDescription(currentDescription);
        } else {
            existingEvent.setDescription(eventUpdateDto.getDescription());
        }

        return eventRepository.save(existingEvent);
    }

    @Override
    public UpdateResponse<Event> updateEventStatus(Long id, EventStatusDto eventStatusDto) {

        UpdateResponse<Event> response = new UpdateResponse<>();

        //check event if exists
        Event existingEvent = eventRepository.findById(id).orElse(null);

        if (existingEvent == null) {
            response.setMessage("No event found for entered id");
            return response;
        }

        existingEvent.setIsApproved(eventStatusDto.getIsApproved());
        existingEvent.setIsDisapproved(eventStatusDto.getIsDisapproved());
        existingEvent.setIsStarted(eventStatusDto.getIsStarted());
        existingEvent.setIsCompleted(eventStatusDto.getIsCompleted());

        if (existingEvent.getIsCompleted()) {
            existingEvent.setEventStatus(eventStatusRepository.findById(4L).orElse(null));
        } else if (existingEvent.getIsStarted()) {
            existingEvent.setEventStatus(eventStatusRepository.findById(3L).orElse(null));
        } else if (existingEvent.getIsDisapproved()) {
            existingEvent.setEventStatus(eventStatusRepository.findById(2L).orElse(null));
        } else if (existingEvent.getIsApproved()) {
            existingEvent.setEventStatus(eventStatusRepository.findById(5L).orElse(null));
        } else {
            existingEvent.setEventStatus(eventStatusRepository.findById(1L).orElse(null));
        }

        if(eventStatusDto.getIsCompleted()){
            existingEvent.setDateCompleted(LocalDate.now());
        }


        Event savedEvent= eventRepository.save(existingEvent);

        //check if the event is completed
        if(savedEvent.getIsCompleted()){
            //fetch completion year as an integer
            Integer completionYear=savedEvent.getDateCompleted().getYear();

            Long organizerId=savedEvent.getOrganizer().getId();

            //find the list of 'MonthlyEarning' for year and organizer id
            List<MonthlyEarning> monthlyEarnings=monthlyEarningRepository.findByOrganizerAndYear(organizerId, completionYear);

            //if no record create one
            if (monthlyEarnings == null || monthlyEarnings.isEmpty()) {
                MonthlyEarning monthlyEarning = new MonthlyEarning();

                monthlyEarning.setOrganizer(savedEvent.getOrganizer());
                monthlyEarning.setYear(completionYear);

                //derive month number
                int monthNumber = savedEvent.getDateCompleted().getMonthValue();

                //derive month name
                String monthName = savedEvent.getDateCompleted().getMonth()
                        .name()
                        .substring(0, 3)   // take first 3 letters (e.g., JAN → JAN)
                        .charAt(0) + savedEvent.getDateCompleted().getMonth()
                        .name()
                        .substring(1, 3).toLowerCase(); // format to Jan

                monthlyEarning.setMonthNumber(monthNumber);
                monthlyEarning.setMonthName(monthName);
                monthlyEarning.setTotalEarnings(savedEvent.getEarningsByEvent());

                monthlyEarningRepository.save(monthlyEarning);
            }

            //if there is a record list check if there is a record for the corresponding completion month
            if (monthlyEarnings != null && !monthlyEarnings.isEmpty()) {
                int monthNumber = savedEvent.getDateCompleted().getMonthValue();
                String monthName = savedEvent.getDateCompleted().getMonth()
                        .getDisplayName(java.time.format.TextStyle.SHORT, java.util.Locale.ENGLISH);

                // try to find an existing monthly record
                MonthlyEarning existingRecord = monthlyEarnings.stream()
                        .filter(m -> m.getMonthNumber().equals(monthNumber))
                        .findFirst()
                        .orElse(null);

                if (existingRecord != null) {
                    // update total earnings
                    existingRecord.setTotalEarnings(
                            existingRecord.getTotalEarnings().add(savedEvent.getEarningsByEvent())
                    );
                    monthlyEarningRepository.save(existingRecord);
                } else {
                    // create new record for that month
                    MonthlyEarning newRecord = new MonthlyEarning();
                    newRecord.setOrganizer(savedEvent.getOrganizer());
                    newRecord.setYear(completionYear);
                    newRecord.setMonthNumber(monthNumber);
                    newRecord.setMonthName(monthName);
                    newRecord.setTotalEarnings(savedEvent.getEarningsByEvent());

                    monthlyEarningRepository.save(newRecord);
                }
            }

            //set system earnings
            List<FinancialData> currentData=financialDataRepository.findAll();

            //get the total earnings
            BigDecimal currentEarnings=currentData.get(0).getPlatformBalance();

            //update total earnings
            currentData.get(0).setPlatformBalance(currentEarnings.add(savedEvent.getEarningsByEvent()));

            financialDataRepository.save(currentData.get(0));
        }

        //find organizer
        Organizer organizer=savedEvent.getOrganizer();

        int updatedEventCount=getActiveEventCountFromOrganizer(organizer,eventStatusDto);

        organizer.setActiveEventsCount(updatedEventCount);

        //save organizer with updated values
        organizerRepository.save(organizer);

        response.setMessage("Event updated successfully");
        response.setUpdatedData(savedEvent);

        return response;
    }

    //Delete an event
    @Override
    public Boolean deleteEvent(Long id) {
        //Check if an event exists
        boolean isExist = eventRepository.existsById(id);

        if (isExist) {
            eventRepository.deleteById(id);

            return true;
        }
        return false;
    }

    @Override
    public MultipleEntityResponse<Integer> findActiveYearsByOrganizer(Long organizerId) {

        MultipleEntityResponse<Integer> response = new MultipleEntityResponse<>();

        Organizer existingOrganizer = organizerRepository.findById(organizerId).orElse(null);

        if(existingOrganizer == null) {
            response.setMessage("Organizer not found");
            return response;
        }

        List<Integer> yearsList=eventRepository.findEventCompletionYearsByOrganizer(organizerId);

        if(yearsList.isEmpty()){
            response.setMessage("No events found for organizer " + organizerId);
            return response;
        }

        response.setMessage("Years found for organizer " + organizerId);
        response.setEntityList(yearsList);

        return response;
    }

    private int getActiveEventCountFromOrganizer(Organizer organizer, EventStatusDto dto) {
        int current = organizer.getActiveEventsCount() == null ? 0 : organizer.getActiveEventsCount();

        // APPROVE: +1  (only when it's the plain "approved" state)
        boolean approveState =
                Boolean.TRUE.equals(dto.getIsApproved()) &&
                        !Boolean.TRUE.equals(dto.getIsDisapproved()) &&
                        !Boolean.TRUE.equals(dto.getIsStarted()) &&
                        !Boolean.TRUE.equals(dto.getIsCompleted()) &&
                        !Boolean.TRUE.equals(dto.getIsPublic());

        if (approveState) {
            return current + 1;
        }

        // COMPLETE: -1 (but never below 0)
        if (Boolean.TRUE.equals(dto.getIsCompleted())) {
            return Math.max(0, current - 1);
        }

        // PUBLISH / START / DISAPPROVE: no change
        return current;
    }

    //generate event id
    private String generateEventId(){
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String datePrefix = "EVT" + today.format(formatter);

        EventSequenceTracker tracker = eventSequenceRepository.findById(today.toString())
                .orElseGet(() -> {
                    EventSequenceTracker newTracker=new EventSequenceTracker();
                    newTracker.setDate(today.toString());
                    newTracker.setSequence(0L);
                    return eventSequenceRepository.save(newTracker);
                });

        synchronized (this) {
            long sequence = tracker.getSequence() + 1;
            tracker.setSequence(sequence);
            eventSequenceRepository.save(tracker);
            return datePrefix + "-" + String.format("%03d", sequence);
        }
    }

}