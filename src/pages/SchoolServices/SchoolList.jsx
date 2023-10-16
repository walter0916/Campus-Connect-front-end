import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import * as schoolService from "../../services/schoolService";

import SearchForm from "../../components/SearchForm/SearchForm"
import SchoolDetails from "../../components/Schools/SchoolDetails"

// css
import styles from './SchoolList.module.css'

const SchoolList = () => {
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    const fetchSchools = async () => {
      const schools = await schoolService.getAllSchools()
      setSchools(schools);
    }
    fetchSchools()
  }, [])

  const handleSchoolSearch = formData => {
    const filteredSchoolResults = schools.filter(school => (
      school.name.toLowerCase().includes(formData.query.toLowerCase()) 
    ))
    setSearchResults(filteredSchoolResults)
    setSchools(filteredSchoolResults)
  }

  const refreshList = () => {
    const fetchSchools = async () => {
      const schools = await schoolService.getAllSchools()
      setSchools(schools);
    }
    fetchSchools()
  }

  return (
      <>
          <SearchForm handleSchoolSearch={handleSchoolSearch}/>
          <div className={styles.buttonContainer}>
          <button className={styles.button30} onClick={refreshList}>Refresh</button>
          </div>
          <div className={styles.container}>
              {schools.map(school => <SchoolDetails key={school.id} school={school} />)}
          </div>
      </>
  );
}

export default SchoolList;