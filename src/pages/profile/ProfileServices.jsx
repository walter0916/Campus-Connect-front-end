// npm modules
import { useState, useEffect } from "react"

// components
import Sidebar from "../../components/SideBar/SideBar"
import UserServices from "../../components/UserServices/UserServices"

// services
import * as serviceService from "../../services/serviceService"

// styles
import styles from './Profiles.module.css'

const ProfileListings = (props) => {
  const [services, setServices] = useState([])
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    const fetchListings = async () => {
      const profileId = props.user.profile
      const serviceData = await serviceService.index()
      const userService = serviceData.filter((listing) => listing.createdBy._id === profileId)
      setServices(userService)
    } 
    fetchListings()
  }, [props.user.profile])

  const handleDeleteService = async (serviceId) => {
    await serviceService.deleteService(serviceId)
    setServices(services.filter(service => service._id !== serviceId))
  }

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  return (
    <>
      <Sidebar />
      <div className={styles.serviceCard}>
        <div className={styles.serviceCardWrap}></div>
        {services.map((service) => 
        <UserServices 
          key={service._id} 
          service={service}  
          handleDeleteService={handleDeleteService}
          toggleEditMode={toggleEditMode}
          /> )}
      </div>
    </>
  )
}
export default ProfileListings