import * as types from "./actionsTypes";
import * as courseApi from "../../api/courseApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function loadCourseSuccess(courses) {
  return { type: types.LOAD_COURSE_SUCCESS, courses };
}

export function createCourseSuccess(course) {
  return { type: types.CREATE_COURSE_SUCCESS, course };
}

export function updateCourseSuccess(course) {
  return { type: types.UPDATE_COURSE_SUCCESS, course };
}

export function deleteCourseOptimistic(course) {
  return { type: types.DELETE_COURSE_OPTIMISTIC, course };
}

export function loadCourses() {
  return function(dispatch) {
    dispatch(beginApiCall());
    return courseApi
      .getCourses()
      .then(courses => {
        dispatch(loadCourseSuccess(courses));
      })
      .catch(err => {
        dispatch(apiCallError(err));
        throw err;
      });
  };
}

//getState let us have access in redux store
//eslint-disable-next-line no-unused-vars
export function saveCourse(course, getState) {
  return async function(dispatch) {
    dispatch(beginApiCall());
    try {
      const saveCourse = await courseApi.saveCourse(course);
      course.id
        ? dispatch(updateCourseSuccess(saveCourse))
        : dispatch(createCourseSuccess(saveCourse));
    } catch (err) {
      dispatch(apiCallError(err));
      throw err;
    }
  };
}

export function deleteCourse(course) {
  return function(dispatch) {
    dispatch(deleteCourseOptimistic(course));
    return courseApi.deleteCourse(course.id);
  };
}
