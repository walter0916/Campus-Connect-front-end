import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import * as bookingService from '../../services/bookingService'

const BookingForm = (props) => {
  
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedStartTime, setSelectedStartTime] = useState('')
  const [selectedEndTime, setSelectedEndTime] = useState('')
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const {state} = useLocation()
  const availabilityData = state.service.availability
  console.log(availabilityData)
  const [formData, setFormData] = useState({
    date: '',
    request:'',
    serviceId: state.service._id
  })

  const navigate = useNavigate()


  useEffect(() => {
    const timeSlots = generateTimeSlots(selectedStartTime, selectedEndTime, 60)
    setAvailableTimeSlots(timeSlots)
  }, [selectedStartTime, selectedEndTime, selectedDate])

  const handleDateChange = (event) => {
    const selectedDate = event.target.value
    setSelectedDate(selectedDate)
    const selectedAvailability = availabilityData.find(item => item.day === selectedDate)
  
    if (selectedAvailability) {
      setSelectedStartTime(selectedAvailability.startTime)
      setSelectedEndTime(selectedAvailability.endTime)
      const timeSlots = generateTimeSlots(selectedAvailability.startTime, selectedAvailability.endTime, 60)
      setAvailableTimeSlots(timeSlots)
  
      // Combine selected date and time and update the formData state
      const combinedDateTime = `${selectedDate} ${selectedAvailability.startTime}`
      setFormData(prevData => ({
        ...prevData,
        date: combinedDateTime,
      }))
    } else {
      setSelectedStartTime('')
      setSelectedEndTime('')
      setAvailableTimeSlots([])
      setFormData(prevData => ({
        ...prevData,
        date: '',
      }))
    }
  }

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    bookingService.create(formData)
    navigate(`/service/${formData.serviceId}`)
  }

  const generateTimeSlots = (startTime, endTime, interval = 60) => {
    const timeSlots = [];
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    const intervalMilliseconds = interval * 60 * 1000
    let currentTime = start
    while (currentTime <= end) {
      const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      timeSlots.push(formattedTime)
      currentTime = new Date(currentTime.getTime() + intervalMilliseconds)
    }
  
    return timeSlots
  }

  const uniqueDates = Array.from(new Set(availabilityData.map(item => item.day)))

  return (
    <>
      <form onSubmit={handleSubmit}>
      <label>Select Date:</label>
      <select name="selectedDate" value={selectedDate} onChange={handleDateChange}>
        <option value="">Select a date</option>
        {uniqueDates.map((day, index) => (
          <option key={index} value={day}>
            {day}
          </option>
        ))}
      </select>

      <label>Select Time:</label>
      <select name="selectedTime">
        <option value="">Select a time</option>
        {availableTimeSlots.map((timeSlot, index) => (
            <option key={index} value={timeSlot}>
              {timeSlot}
            </option>
          ))}
      </select>
      <label htmlFor="">Describe Your Request</label>
      <input 
      type="text" 
      name='request'
      onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
    </>
  );
}

export default BookingForm;