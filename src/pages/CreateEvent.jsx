import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getDoc, doc, addDoc, collection, updateDoc, arrayUnion, query } from "firebase/firestore";
import { db } from "../firebase/config";
import { Timestamp } from "firebase/firestore";


const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    amount: "",
    currency: "USD",
    detail: "",
    endTime: "",
    primaryImage: null,
  });

  // Handle Form Submission
  const submittofirebase = async (formData) => {

    try {
      // Add data to Firestore collection "events"

    

      await addDoc(collection(db, "auction", "items"), {
        title: formData.title,
        subtitle: formData.subtitle,
        amount: formData.amount,
        currency: formData.currency,
        detail: formData.detail,
        endTime: formData.endTime,
        primaryImage: formData.primaryImage ? formData.primaryImage.name : "follow_cxo_old.png", // Storing image name
        createdAt: new Date(),
      });

      alert("Event successfully created!");
      setFormData({
        title: "",
        subtitle: "",
        amount: "",
        currency: "USD",
        detail: "",
        endTime: "",
        primaryImage: null,
      });
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to create event!");
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const getLastItem = async () => {
  try {
    const docRef = doc(db, "auction", "items"); // ✅ Fetching the document
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data(); // Get all fields inside "items" document
      
      const itemKeys = Object.keys(data)
                    .filter(key => "id" in data[key]) // ✅ Keeps items with "id" (even 0/null)
                    .sort((a, b) => data[a].id - data[b].id); // ✅ Sorts by `id` in ASC order
      const lastItemKey = itemKeys[itemKeys.length - 1]; // Get last item key

      console.log("Last Item:", data[lastItemKey]); // Fetch the last item
      return data[lastItemKey];
    } else {
      console.log("No items found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching last item:", error);
    return null;
  }
};

const fetchLastItem = async () => {
  const lastItem = await getLastItem(); // ⏳ Waits for the result
  console.log("Last Item Retrieved:", lastItem);
  return lastItem;
  // Execute the next steps after getting the last item
};


  // Handle File Upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, primaryImage: e.target.files[0] });
  };

  const generateRandomString = () => {
 return Math.random().toString(36).substring(2, 12).toLowerCase(); 
};

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Created:", formData);
    

  try {
      // Reference to the "auction/items" document
      fetchLastItem().then((lastItem) => {
      console.log("last item:",lastItem);
      var nextitemid = 50;
      if (lastItem != null ) {
        nextitemid = lastItem.id + 1;
      }
    
      const docRef = doc(db, "auction", "items");
      const primary_image_value = formData.title.includes("Drive") ? "bmw" : "charity";
    
      const formDatasample = {
        title: formData.title,
        subtitle: formData.subtitle,
        amount: formData.amount,
        currency: formData.currency,
        detail: formData.detail,
        endTime: Timestamp.fromDate(new Date(formData.endTime)),
        primaryImage: primary_image_value,
        secondaryImage: primary_image_value,
        id: nextitemid
      };
      const itemid = "item0000"+nextitemid+"_bid00000";
      // Update the document and add new item to the array
      updateDoc(docRef, {
        [itemid]: formDatasample, // Append new item to Firestore array
      });


      getEmailContentFromAI(formData);
      alert("Item added successfully!");
      setFormData({
        title: "",
        subtitle: "",
        amount: "",
        currency: "",
        detail: "",
        endTime: "",
        primaryImage: "",
      });
      }).catch((error) => {
        console.error("Error fetching last item:", error);
      });

      
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item.");
    }


    
    
    alert("Event created successfully!");
  };

  const getEmailContentFromAI = async (data) => {
    try {
    const charityeventdata = JSON.stringify(data);
    const aidata = {
        "model": "anthropic-claude-3-5-sonnet",
        "messages": [{
              "content": "create a sympathy email content for a charity with following event details in json" + charityeventdata,
              "role": "user"}],
        "max_tokens": 2000,
        "temperature": 0,
        "top_p": 1,
        "system_instructions": "You are an AI assistant that generates engaging and persuasive email content to encourage bidding for an event for charity. Given event details such as title, subtitle, amount, currency, detail, endTime of bid. create a warm and compelling email that connects emotionally with recipients to participate in event for the charity cause. participate button with this link \"https://vishwa6990.github.io/hack-for-charity/\" Ensure the email has a friendly yet professional tone, a clear call-to-action, and highlights the impact of their donation. Give the output in stringified json format with simple subject and content in html without any additional information"
      };
      const response = await fetch("http://localhost:5005/api/getEmailContent", {
        method: "POST", // HTTP method
        headers: {
          "Content-Type": "application/json", // JSON content type
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Im5hbWUiOiJNdXRodSBLdW1hciIsImVtYWlsIjoibXV0aHUua3VtYXJAZnJlc2h3b3Jrcy5jb20iLCJpbWFnZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lya3VNUzJ1QTJqbF8tT0JGTE82bV9NR2lBdGN1ZVVpRDB6QTE4QWxELW0zWT1zOTYtYyJ9LCJqdGkiOiI4bjdaMnZQRlg5cnpQSm51cGtuQmYiLCJpYXQiOjE3Mzg4Njc5MDksImV4cCI6MTczOTQ3MjcwOX0.XGcIiZwza2I7zgxH2mMtxKbPT8Vd_AlrSUQUKekETtI"
        },
        body: JSON.stringify(aidata), // Convert data to JSON
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json(); // Parse JSON response
      console.log("AI Success:", result);
      const emailContent =  JSON.parse(result.response);

      
      sendEmail(emailContent);
      return result;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };


  const sendEmail = async (data) => {
    try {
    const subject = "Hack For Charity! New Event -" + data.subject;
    console.log("email subject",subject);
    console.log("email content",data.content);
      const maildata = {
          "subject": subject,
          "html": data.content,
          "text": "text",
          "accountId": "901390391031",
          "to": [
              {
                  "email": "muthu.kumar@freshworks.com",
                  "name": "Muthu"
              },
              {
                  "email": "vishwakumar.ks@freshworks.com",
                  "name": "Vishwa"
              },
              {
                "email": "sridevivishwa1993@gmail.com",
                "name": "Sridevi"
              },
              {
                "email": "ram.konijeti@freshworks.com",
                "name": "Ram"
              },
              {
                "email": "amrit.mishra@freshworks.com",
                "name": "Amrit"
              },
              {
                "email": "manoj.ganeshsankar@freshworks.com",
                "name": "Manoj"
              }
          ],
          "from": {
              "email": "charity@email-stag.com",
              "name": "Charity",
              "verified": "false"
          }
      }
      const response = await fetch("http://localhost:5005/api/sendEmail", {
        method: "POST", // HTTP method
        headers: {
          "Content-Type": "application/json", // JSON content type
          "Authorization": "FWEM-STAG-9AE328-543.A4ABF5512768D02C2E3566B2E6C990261D8C"
        },
        body: JSON.stringify(maildata), // Convert data to JSON
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json(); // Parse JSON response
      console.log("Mail Success:", result);
      return result;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "450px" }}>
        <h3 className="text-center mb-4">Create Event</h3>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
          </div>

          {/* Subtitle */}
          <div className="mb-3">
            <label className="form-label">Subtitle</label>
            <input type="text" name="subtitle" className="form-control" value={formData.subtitle} onChange={handleChange} required />
          </div>

          {/* Amount */}
          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input type="number" name="amount" className="form-control" value={formData.amount} onChange={handleChange} required />
          </div>

          {/* Currency */}
          <div className="mb-3">
            <label className="form-label">Currency</label>
            <select name="currency" className="form-select" value={formData.currency} onChange={handleChange} required>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          {/* Detail */}
          <div className="mb-3">
            <label className="form-label">Detail</label>
            <textarea name="detail" className="form-control" rows="3" value={formData.detail} onChange={handleChange} required></textarea>
          </div>

          {/* End Time */}
          <div className="mb-3">
            <label className="form-label">End Time</label>
            <input type="datetime-local" name="endTime" className="form-control" value={formData.endTime} onChange={handleChange} required />
          </div>

          {/* Primary Image 
          <div className="mb-3">
            <label className="form-label">Primary Image</label>
            <input type="file" name="primaryImage" className="form-control" onChange={handleFileChange} accept="image/*" required />
          </div>
          */}

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
