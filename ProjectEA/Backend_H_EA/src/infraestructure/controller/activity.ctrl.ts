import { ActivityUseCase } from "../../application/activityUseCase";
import { Request, Response } from "express";

export class ActivityController {
  constructor(private activityUseCase: ActivityUseCase) {
    this.getActivityByIdCtrl = this.getActivityByIdCtrl.bind(this);
    this.listActivityCtrl = this.listActivityCtrl.bind(this);
    this.updateActivityCtrl = this.updateActivityCtrl.bind(this);
    this.deleteActivityCtrl = this.deleteActivityCtrl.bind(this);
    this.listActivityPagCtrl = this.listActivityPagCtrl.bind(this);
    this.getNumActivityCtrl = this.getNumActivityCtrl.bind(this);
    this.insertActivityCtrl = this.insertActivityCtrl.bind(this);
    this.getParticipantsOfActivityCtrl =
      this.getParticipantsOfActivityCtrl.bind(this);
    this.getActivitiesByUserAndWeekCtrl =
      this.getActivitiesByUserAndWeekCtrl.bind(this);
    this.getFollowedUsersActivitiesCtrl =
      this.getFollowedUsersActivitiesCtrl.bind(this);

    this.getActivitiesByLocationCtrl =
      this.getActivitiesByLocationCtrl.bind(this);
    
      this.getAllActivitiesByUserCtrl=this.getAllActivitiesByUserCtrl.bind(this);
      this.getAllActivitiesCreatedByUserCtrl=this.getAllActivitiesCreatedByUserCtrl.bind(this);
      this.getActivitiesByUserAndMonthCtrl=this.getActivitiesByUserAndMonthCtrl.bind(this);
      this.getActivitiesByUserLast6WeeksCtrl=this.getActivitiesByUserLast6WeeksCtrl.bind(this);
      this.getActivitiesByMonthAndYearCtrl=this.getActivitiesByMonthAndYearCtrl.bind(this);
  }

  /*
    public async getActivitiesByLocationCtrl({params}:Request,res:Response){
        const { locationId = '' } = params;
        const response = await this.activityUseCase.getActivitiesByLocation(`${locationId}`);
        res.send(response)
    }
    */

  public async getActivitiesByLocationCtrl({ params }: Request, res: Response) {
    console.log("ENTRA AQUÍ");
    const { locationId = "" } = params;
    const response = await this.activityUseCase.getActivitiesByLocation(
      `${locationId}`
    );
    console.log("RESPUESTA: " + response);
    const data = response ? response : "NOT_FOUND";
    res.send(data);
  }

  public async getActivityByIdCtrl({ params }: Request, res: Response) {
    const { uuid = "" } = params;
    const response = await this.activityUseCase.getActivityById(`${uuid}`);
    res.send(response);
  }

  public async listActivityCtrl(req: Request, res: Response) {
    const response = await this.activityUseCase.listActivity();
    res.send(response);
  }

  public async updateActivityCtrl({ params, body }: Request, res: Response) {
    const { uuid = "" } = params;
    const response = await this.activityUseCase.updateActivity(`${uuid}`, body);
    res.send(response);
  }

  public async deleteActivityCtrl({ params }: Request, res: Response) {
    const { uuid = "" } = params;
    const response = await this.activityUseCase.deleteActivity(`${uuid}`);
    res.send(response);
  }

  public async listActivityPagCtrl({ params }: Request, res: Response) {
    const { numPage = "" } = params;
    const response = await this.activityUseCase.listActivityPag(`${numPage}`);
    res.send(response);
  }

  public async getNumActivityCtrl(req: Request, res: Response) {
    const response = await this.activityUseCase.getNumActivity();
    const data = response ? response : "NOT_FOUND";
    res.send(data);
  }

  public async insertActivityCtrl({ body }: Request, res: Response) {
    const response = await this.activityUseCase.insertActivity(body);
    res.send(response);
  }

  public async getParticipantsOfActivityCtrl(
    { params }: Request,
    res: Response
  ) {
    const { uuid, numPage } = params;
    const response = await this.activityUseCase.getParticipantsOfActivity(
      uuid,
      numPage
    );
    const data = response ? response : "NOT_FOUND";
    res.send(data);
  }

  public async getActivitiesByUserAndWeekCtrl(
    { params }: Request,
    res: Response
  ) {
    const { uuid, date } = params;
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0); // Establecer hora en UTC a las 00:00:00
    startDate.setUTCDate(startDate.getUTCDate() + 1);
    console.log("controller hour received:", date);
    console.log("controller hour set:", startDate);
    const response = await this.activityUseCase.getActivitiesByUserAndWeek(
      uuid,
      startDate
    );
    const data = response ? response : "NOT_FOUND";
    res.send(data);
  }

  public async getFollowedUsersActivitiesCtrl(
    { params }: Request,
    res: Response
  ) {
    const { uuid, numPage, date } = params;
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0); // Establecer hora en UTC a las 00:00:00
    startDate.setUTCDate(startDate.getUTCDate() + 1);
    const response = await this.activityUseCase.getFollowedUsersActivities(
      uuid,
      numPage,
      startDate
    );
    const data = response ? response : "NOT_FOUND";
    res.send(data);
  }
  public async getAllActivitiesByUserCtrl({params}:Request,res:Response){
    const {uuid}=params;
    console.log("controller",uuid);
    const response=await this.activityUseCase.getAllActivitiesByUser(uuid); 
    const data=response ? response:"NOT_FOUND";
    res.send(data);
  }

  public async getAllActivitiesCreatedByUserCtrl({params}:Request,res:Response){
      const {uuid}=params;
      console.log("controller",uuid);
      const response=await this.activityUseCase.getAllActivitiesCreatedByUser(uuid); 
      const data=response ? response:"NOT_FOUND";
      res.send(data);
  }

  public async getActivitiesByUserAndMonthCtrl({params}:Request,res:Response){
    const {uuid,date}=params;
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0); // Establecer hora en UTC a las 00:00:00
    startDate.setUTCDate(startDate.getUTCDate() + 1);
    const response=await this.activityUseCase.getActivitiesByUserAndMonth(uuid,startDate); 
    const data=response ? response:"NOT_FOUND";
    res.send(data);
}

  public async getActivitiesByUserLast6WeeksCtrl({params}:Request,res:Response){
    const {uuid}=params;
    const response=await this.activityUseCase.getActivitiesByUserLast6Weeks(uuid); 
    const data=response ? response:"NOT_FOUND";
    res.send(data);
  }

  public async getActivitiesByMonthAndYearCtrl({params}:Request,res:Response){
    const {uuid,month,year}=params;
    const response=await this.activityUseCase.getActivitiesByMonthAndYear(uuid,month,year); 
    const data=response ? response:"NOT_FOUND";
    res.send(data);
}

}
