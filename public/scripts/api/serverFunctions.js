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

      // const data = await Promise.all([
      //   fetch(url, {
      //     method: "GET",
      //     headers: { "Accept": "application/json" }
      //   })
      //   .then(res => res.json()),
      //   new Promise((res) =>
      //       setTimeout(() => res(), 5000)
      //   )
      // ])
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