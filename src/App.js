import './App.css';
import { ChangeEvent } from 'react';
import { render } from 'react-dom';
import React, {Component} from 'react';
import axios, { Axios } from 'axios';
import JSONDATA from './Applicants2.json';
import { useState } from 'react';
import { calculateNewValue } from '@testing-library/user-event/dist/utils';
import csv from 'csvtojson';



const App=  () =>{

  //file uploadign

  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFiles([...files, file]);
   
    
    console.log("ooga")

}

const UploadResume = (event) => {
  const file = files[0];
  
  const reader = new FileReader();
  reader.onload = (event) => {
      csv().fromString(event.target.result).then((jsonObj) => {
          let applicant = jsonObj[0];
          applicant.skills = applicant.skills.split(",")
          JSONDATA.push(applicant)
          //console.log(jsonObj);
          ///console.log(JSON.stringify(jsonObj))
          //console.log(jsonObj[0])

          //JSONDATA.push(jsonObj[0])
      });
  }
  
  reader.readAsText(file);
  console.log("booga")

}

  let formData = new FormData();
  /*
  const handleFileUpload = (e) => {

    console.log(e.target.files[0]) ;
    if (e.target && e.target.files[0]){
      formData.append ('file', e.target.files[0]);
    }
  }
  const SubmitFileData = async() =>{
    const res = await axios.post(
      "https://v2.convertapi.com/upload",
      {formData}
      
    )
    
      console.log(res.data);
    
  }*/

  //Filtering Data
  const [searchTerm, setSearchTerm, ] = useState('')
  const [nameSearchTerm, setNameSearchTerm, ] = useState('')
  function matchesSearch (applicant) {
    if (nameSearchTerm !== "") {
        let fullName = `${applicant.first_name} ${applicant.last_name}`.toLowerCase();
        if (!fullName.includes(nameSearchTerm.toLowerCase())) return false;
    }
    let requiredSkills = searchTerm.split(" ");
    for (let requiredSkill of requiredSkills) {
        if (!applicant.skills.some(skill => skill.toLowerCase().includes(requiredSkill))) {
            return false;
        }
    }
    return true;     
}
  
//get file name
function fileName (){
  try {
    return files[0].name
  } catch (error) {
    return ""
  }
}

return (
  <div className="App">
    <h1> Resume Parser</h1>
    <div className='chooseFile'>
      <label for="file-upload" className='file_upload_label'>
        Choose File
      </label>
      <input id="file-upload" type ="file" name ="file_upload" onChange={handleFileUpload}></input>
    </div>
   
    
    <div>
      {fileName() ? <button className='UploadResumeButton' onClick={UploadResume}>Upload {fileName()}</button>:""}
      <br></br><br></br>

      
      <label for= "Name_Search" >Applicant Name</label>
      <input id="Name_Search" className="search" type= "text" placeholder='Lookup Name..' onChange={event => {setNameSearchTerm(event.target.value)}}></input>
     
      <label for= "Skill_Search" >Applicant Skill</label>
      <input id="Skill_Search" className="search" type= "text" placeholder='Lookup Skills..' onChange={event => {setSearchTerm(event.target.value)}}></input>
      <br></br>
      <div className='Search-Heading'>
        <h2>Results</h2>
        
      </div>
      <table>
                <thead>
                  <tr className='TableHeading' >
                    <th>Name</th>
                    <th>Skill</th>  
                  </tr>
                </thead>
                <tbody>
                  
                  
                
      {JSONDATA.filter(matchesSearch).map((val, key) => {
        return (
          
            
              
        <tr className='Applicants' key={key}>
          <td>
            {val.first_name + " " + val.last_name}
          </td>
          <td>
            {" "+val.skills}
          </td>
        </tr>
              
              
              
            
          
        );
      })}

      </tbody>
                
      </table>
    </div>
  </div>
);
}


export default App;
