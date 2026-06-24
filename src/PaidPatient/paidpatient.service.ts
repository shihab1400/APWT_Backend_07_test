import { Injectable } from '@nestjs/common';

@Injectable()
export class PaidPatientService {

  getChatHistory(): object {
    return {

      message: 'Chat history fetched successfully',
      data: []
    };
  }

  getAssessmentQuiz(): object {
    return {
      message: 'Assessment quiz fetched successfully',
      data: []
    };
  }

  getAppointmentDetails(id: number): object {
    const appointmentDetails = [
      {
        id: 1,
        name: "Nipa",
        age: 60,
      },
      {
        id: 2,
        name: "Akter",
        age: 60,
      },
      {
        id: 3,
        name: "Nilima",
        age: 60,
      },
    ]
    return appointmentDetails.filter((ad) => ad.id === id);
  }

  getPaymentRecords(userId: number, type: string): object {

    const paymentRecords = [
      {
        userid: 1,
        name:"Nipa",
        type: "monthly",
        amount: 100
      },
      {
        userid: 2,
        name:"Neela",
        type: "yearly",
        amount: 10000
      },
      {
        userid: 3,
        name:"sadia",
        type: "monthly",
        amount: 100000
      },
      
      
    ]
    return paymentRecords.filter((pd) => pd.userid === userId && pd.type === type);
  }

  createRecord(data: any): object {
    return {
      message: 'Record created successfully',
      receivedData: data
    };
  }
}