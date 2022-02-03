async function apiMethod(method, url, body) {
  if (method === "GET") {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
      let data = await response.json();
      return data
    } else {
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
        return data;
    } else {
      return null;
    }
  }
}

export const api = {

  getSubjects: async () => {
    return await apiMethod("GET", "/getSubjects")
  },

  getPrograms: async () => {
    return await apiMethod("GET", "/getPrograms")
  },

  getTeachers: async () => {
    return await apiMethod("GET", "/getTeachers")
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

  saveNewSubjects: async (subjects, programId, name) => {
    return await apiMethod("POST", "/saveNewSubjects", { subjects, programId, name })
  },

  deleteProgram: async (dto) => {
    return await apiMethod("POST", "/deleteProgram", dto)
  },

  saveTeacher: async (dto) => {
    return await apiMethod("POST", "/saveTeacher", dto)
  }, 

  getSubjectsByTeacher: async (dto) => {
    return await apiMethod("POST", "/getSubjectsByTeacher", dto)
  }, 

}