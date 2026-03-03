package handlers

import "net/http"


func Client(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(200)
	w.Write([]byte("OK"))
}

func CreateClient(w http.ResponseWriter, r *http.Request) {
	
}


