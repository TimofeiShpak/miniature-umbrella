async function apiMethod(method, url, body) {
  loader.classList.remove('hide');
  if (method === "GET") {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" }
    })
    if (response.ok === true) {
      let data = await response.json();
      loader.classList.add('hide');
      return data;
    } else {
      loader.classList.add('hide');
      return null;
    }
  } else if (method === "POST") {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (response.ok === true) {
        let data = await response.json();
        loader.classList.add('hide');
        return data;
    } else {
      loader.classList.add('hide');
      return null;
    }
  }
}

export const api = {

  getPrograms: async () => {
    return await apiMethod("GET", "/getPrograms")
  },

  getTeachers: async (dto) => {
    return await apiMethod("POST", "/getTeachers", dto)
  },

  getTeacherById: async (dto) => {
    return await apiMethod("POST", "/getTeacherById", dto)
  },

  getProgramById: async (dto) => {
    return await apiMethod("POST", "/getProgramById", dto)
  },

  saveSubjects: async (dto) => {
    return await apiMethod("POST", "/saveSubjects", dto)
  },

  getSubjectsByProgram: async (programId) => {
    return await apiMethod("POST", "/getSubjectsByProgram", { programId })
  },

  getSubjectsByTeacher: async (dto) => {
    return await apiMethod("POST", "/getSubjectsByTeacher", dto)
  },

  saveNewSubjects: async (subjects, programId, name) => {
    return await apiMethod("POST", "/saveNewSubjects", { subjects, programId, name })
  },

  saveNewProgram: async (dto) => {
    return await apiMethod("POST", "/saveNewProgram", dto)
  },

  deleteProgram: async (dto) => {
    return await apiMethod("POST", "/deleteProgram", dto)
  },

  deleteRow: async (dto) => {
    return await apiMethod("POST", "/deleteRow", dto)
  },

  saveTeacher: async (dto) => {
    return await apiMethod("POST", "/saveTeacher", dto)
  }, 

  deleteTeacher: async (dto) => {
    return await apiMethod("POST", "/deleteTeacher", dto)
  }, 

  getSubjectsByTeacher: async (dto) => {
    return await apiMethod("POST", "/getSubjectsByTeacher", dto)
  }, 

  checkTeacher: async (dto) => {
    return await apiMethod("POST", "/checkTeacher", dto)
  }, 

}