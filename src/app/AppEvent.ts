import { BehaviorSubject, Observable, Subject } from "rxjs";

const messageEvent: Subject<any> = new BehaviorSubject(null);
const sessionUserEvent: Subject<any> = new BehaviorSubject(null);
const loaderEvent: Subject<any> = new BehaviorSubject(null);
const progressEvent: Subject<any> = new BehaviorSubject(null);

const messageEmit = (data: any) => {
  messageEvent.next(data);
};

const loaderEmit = (data: any) => {
  loaderEvent.next(data);
};

const progressEmit = (data: any) => {
  progressEvent.next(data);
};

const sessionUserEmit = (data: any) => {
  if (data) {
    sessionUserEvent.next(data);
  } else {
    // Store.clearData();
    sessionUserEvent.next(null);
  }
};

const AppEvent = {
  messageEvent,
  messageEmit,
  sessionUserEvent,
  sessionUserEmit,
  loaderEvent,
  loaderEmit,
  progressEvent,
  progressEmit,
};

export default AppEvent;
