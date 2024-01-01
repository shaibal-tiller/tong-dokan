import React from "react";
import { useContext } from "react";


export const AppContext = React.createContext()

export const GetContext = () => {
    const myContext = useContext(AppContext);
    return myContext
}
 