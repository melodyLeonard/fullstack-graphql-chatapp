export function validEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function isEmpty(data) {
  if (data.trim() === "") {
    return true;
  } else {
    return false;
  }
}

export function ismatchPassword(password, confirmPassword) {
  if (password === confirmPassword) {
    return true;
  } else {
    return false;
  }
}
