# Complete MongoDB Database Schema Documentation

## Common Fields (All Collections)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| _id | ObjectId | Primary Key, Auto-generated | Unique identifier |
| createdAt | Date | Auto-generated, Immutable | Creation timestamp |
| updatedAt | Date | Auto-updated | Last update timestamp |

## 1. User Schema (users)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| name | String | NOT NULL | User's full name |
| contactNumber | String | NOT NULL | Contact information |
| dateOfBirth | Date | NOT NULL | Birth date |
| email | String | NOT NULL, UNIQUE | Email address |
| password | String | NOT NULL | Hashed password |
| barangay | String | NOT NULL | Barangay name |
| isVerified | Boolean | DEFAULT false | Email verification status |
| role | String | DEFAULT "user" | User role |
| isActive | Boolean | DEFAULT true | Account status |
| notifications | Array[NotificationSchema] | - | User notifications |
| unreadNotifications | Number | DEFAULT 0 | Count of unread notifications |

## 2. Barangay Clearance Schema (barangayclearances)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| userId | ObjectId | NOT NULL, Foreign Key (User) | Reference to User |
| name | String | NOT NULL | Applicant name |
| email | String | NOT NULL | Email address |
| barangay | String | NOT NULL | Barangay name |
| purpose | String | NOT NULL | Purpose of clearance |
| contactNumber | String | NOT NULL | Contact information |
| dateOfIssuance | Date | - | Issue date |
| isVerified | Boolean | DEFAULT false | Verification status |
| status | String | ENUM ["Pending", "Approved", "Completed", "Rejected"], DEFAULT "Pending" | Application status |
| dateApproved | Date | DEFAULT null | Approval date |
| dateCompleted | Date | DEFAULT null | Completion date |

## 3. Barangay Indigency Schema (barangayindigencies)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| userId | ObjectId | NOT NULL, Foreign Key (User) | Reference to User |
| name | String | NOT NULL | Applicant name |
| email | String | NOT NULL | Email address |
| barangay | String | NOT NULL | Barangay name |
| contactNumber | String | NOT NULL | Contact information |
| purpose | String | NOT NULL | Purpose |
| dateOfIssuance | Date | - | Issue date |
| isVerified | Boolean | DEFAULT false | Verification status |
| status | String | ENUM ["Pending", "Approved", "Completed", "Rejected"], DEFAULT "Pending" | Application status |
| dateApproved | Date | DEFAULT null | Approval date |
| dateCompleted | Date | DEFAULT null | Completion date |

## 4. Blotter Report Schema (blotterreports)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| complainantName | String | NOT NULL | Name of complainant |
| complainantAge | String | NOT NULL | Age of complainant |
| complainantGender | String | NOT NULL, ENUM ["Male", "Female", "Other"] | Gender |
| complainantCivilStatus | String | NOT NULL, ENUM ["Single", "Married", "Widowed", "Separated"] | Civil status |
| complainantAddress | String | NOT NULL | Address |
| complainantContact | String | NOT NULL | Contact info |
| respondentName | String | NOT NULL | Name of respondent |
| respondentAddress | String | - | Respondent address |
| respondentContact | String | - | Respondent contact |
| incidentDate | Date | NOT NULL | Date of incident |
| incidentTime | String | NOT NULL | Time of incident |
| incidentLocation | String | NOT NULL | Location |
| incidentType | String | NOT NULL | Type of incident |
| narrative | String | NOT NULL | Incident description |
| motive | String | - | Motive |
| witnessName | String | - | Witness name |
| witnessContact | String | - | Witness contact |
| evidenceFile | Object | - | Evidence details |
| actionRequested | String | NOT NULL, ENUM ["Mediation", "Barangay Intervention", "Police/Court Action"] | Action type |
| status | String | ENUM ["Pending", "Under Investigation", "Resolved", "Closed"], DEFAULT "Pending" | Case status |
| userId | ObjectId | Foreign Key (User) | Reference to User |

## 5. Business Clearance Schema (businessclearances)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| userId | ObjectId | NOT NULL, Foreign Key (User) | Reference to User |
| ownerName | String | NOT NULL | Business owner name |
| businessName | String | NOT NULL | Name of business |
| barangay | String | NOT NULL | Barangay location |
| businessType | String | NOT NULL | Type of business |
| businessNature | String | NOT NULL, ENUM ["Single Proprietorship", "Partnership", "Corporation"] | Business structure |
| ownerAddress | String | NOT NULL | Owner's address |
| contactNumber | String | NOT NULL | Contact information |
| email | String | NOT NULL | Email address |
| dtiSecRegistration | String | NOT NULL | DTI/SEC registration |
| mayorsPermit | String | - | Mayor's permit |
| leaseContract | String | - | Lease contract |
| barangayClearance | String | NOT NULL | Barangay clearance |
| fireSafetyCertificate | String | - | Fire safety cert |
| sanitaryPermit | String | - | Sanitary permit |
| validId | String | NOT NULL | Valid ID |
| status | String | ENUM ["Pending", "Approved", "Completed", "Rejected"], DEFAULT "Pending" | Application status |
| dateApproved | Date | DEFAULT null | Approval date |
| dateCompleted | Date | DEFAULT null | Completion date |

## 6. Cedula Schema (cedulas)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| userId | ObjectId | NOT NULL, Foreign Key (User) | Reference to User |
| name | String | NOT NULL | Applicant name |
| dateOfBirth | String | NOT NULL | Birth date |
| placeOfBirth | String | NOT NULL | Place of birth |
| barangay | String | NOT NULL | Barangay name |
| civilStatus | String | NOT NULL, ENUM ["Single", "Married", "Widowed", "Separated"] | Civil status |
| occupation | String | NOT NULL | Occupation |
| employerName | String | - | Employer name |
| employerAddress | String | - | Employer address |
| tax | Number | NOT NULL | Tax amount |
| status | String | ENUM ["Pending", "Approved", "Completed", "Rejected"], DEFAULT "Pending" | Application status |
| dateApproved | Date | DEFAULT null | Approval date |
| dateCompleted | Date | DEFAULT null | Completion date |

## 7. Incident Report Schema (incidentreports)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| category | String | NOT NULL | Incident category |
| subCategory | String | NOT NULL | Sub-category |
| date | String | NOT NULL | Incident date |
| time | String | NOT NULL | Incident time |
| location | String | NOT NULL | Location |
| description | String | NOT NULL, MIN(10) | Description |
| reporterName | String | NOT NULL | Reporter name |
| reporterContact | String | NOT NULL | Contact info |
| status | String | ENUM ["New", "In Progress", "Resolved"], DEFAULT "New" | Status |
| barangay | String | NOT NULL | Barangay |
| userId | ObjectId | NOT NULL, Foreign Key (User) | Reference to User |
| evidenceFile | Object | - | Evidence details |

## 8. Log Schema (logs)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| userId | ObjectId | NOT NULL, Foreign Key (User) | Reference to User |
| action | String | NOT NULL | Action performed |
| details | String | - | Additional details |
| timestamp | Date | DEFAULT Now | Action timestamp |
| type | String | NOT NULL, ENUM | Log type |

## 9. Officials Schema (officials)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| name | String | NOT NULL | Official name |
| position | String | NOT NULL | Position |
| contactNumber | String | NOT NULL | Contact info |
| image | Object | - | Profile image |
| barangay | String | NOT NULL | Barangay |
| status | String | ENUM ["Active", "Inactive"], DEFAULT "Active" | Status |
| createdBy | ObjectId | NOT NULL, Foreign Key (User) | Creator reference |

## 10. OTP Schema (otpverifications)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| userId | String | NOT NULL | User reference |
| otp | String | NOT NULL | OTP code |
| createdAt | Date | NOT NULL | Creation time |
| expiresAt | Date | NOT NULL | Expiration time |

## 11. Transaction History Schema (transactionhistories)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| userId | ObjectId | NOT NULL, Foreign Key (User) | User reference |
| transactionId | ObjectId | NOT NULL | Transaction ref |
| residentName | String | NOT NULL | Resident name |
| requestedDocument | String | NOT NULL | Document type |
| dateRequested | Date | NOT NULL | Request date |
| dateApproved | Date | - | Approval date |
| dateCompleted | Date | - | Completion date |
| barangay | String | NOT NULL | Barangay |
| action | String | NOT NULL | Action taken |
| status | String | ENUM ["Pending", "Approved", "Completed", "Rejected"] | Status |
| approvedBy | String | - | Approver |
| timestamp | Date | DEFAULT Now | Timestamp |

## 12. Upcoming Events Schema (upcomingevents)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| title | String | NOT NULL | Event title |
| description | String | NOT NULL | Description |
| date | Date | NOT NULL | Event date |
| time | String | NOT NULL | Event time |
| barangay | String | NOT NULL | Location |
| location | String | NOT NULL | Specific venue |
| createdBy | ObjectId | NOT NULL, Foreign Key (User) | Creator reference |

## 13. User Verification Schema (userverifications)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| userId | String | NOT NULL | User reference |
| uniqueString | String | NOT NULL | Verification string |
| createdAt | Date | NOT NULL | Creation time |
| expireAt | Date | NOT NULL | Expiration time |

## Indexes
