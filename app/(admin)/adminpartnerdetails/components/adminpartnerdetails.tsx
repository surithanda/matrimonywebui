import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
function adminpartner() {
  return (
    <div className="mainAdminPanel">
      <div className="partnerupperDiv flex justify-between items-center self-stretch">
        <h3 className="BRCobane32600">Add Partner Details</h3>
        <Link href="#" className="YellowBtn">
          Submit
        </Link>
      </div>
      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="partnerName">Partner Name</label>
            <input type="text" id="partnerName" placeholder="Partner Name" />
          </div>
          <div className="form-group">
            <label htmlFor="partnerID">Partner ID</label>
            <input type="text" id="partnerID" placeholder="P2810" disabled />
          </div>
          <div className="form-group">
            <label htmlFor="establishedYear">Established Year</label>
            <input
              type="text"
              id="establishedYear"
              placeholder="Established Year"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" placeholder="Address" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input type="text" id="city" placeholder="City" />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input type="text" id="state" placeholder="State" />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input type="text" id="country" placeholder="Country" />
          </div>
          <div className="form-group">
            <label htmlFor="zip">Zip</label>
            <input type="text" id="zip" placeholder="Zip" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="primaryPhone">Primary Phone</label>
            <input type="text" id="primaryPhone" placeholder="Primary Phone" />
          </div>
          <div className="form-group">
            <label htmlFor="secondaryPhone">Secondary Phone</label>
            <input
              type="text"
              id="secondaryPhone"
              placeholder="Secondary Phone"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="partnerType">Partner Type</label>
            <input type="text" id="partnerType" placeholder="Partner Type" />
          </div>
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input type="text" id="website" placeholder="Website" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="facebook">Facebook</label>
            <input type="text" id="facebook" placeholder="Facebook" />
          </div>
          <div className="form-group">
            <label htmlFor="instagram">Instagram</label>
            <input type="text" id="instagram" placeholder="Instagram" />
          </div>
          <div className="form-group">
            <label htmlFor="youtube">Youtube</label>
            <input type="text" id="youtube" placeholder="Youtube" />
          </div>
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn</label>
            <input type="text" id="linkedin" placeholder="LinkedIn" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="subscriptionType">Subscription Type</label>
            <input
              type="text"
              id="subscriptionType"
              placeholder="Subscription Type"
            />
          </div>
          <div className="form-group">
            <label htmlFor="subscriptionStartDate">
              Subscription Start Date
            </label>
            <input
              type="text"
              id="subscriptionStartDate"
              placeholder="Subscription Start Date"
            />
          </div>
          <div className="form-group">
            <label htmlFor="subscriptionEndDate">Subscription End Date</label>
            <input
              type="text"
              id="subscriptionEndDate"
              placeholder="Subscription End Date"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default adminpartner;
