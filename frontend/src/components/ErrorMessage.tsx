//se define children como un objeto de tipo ReactNode para que pueda recibir cualquier tipo de contenido, incluyendo texto, elementos JSX, etc.
const ErrorMessage = ({children}:{children:React.ReactNode}) => {
    return ( 
        <>
        <p className="bg-red-50 text-red-600 p-3 text-center rounded-lg font-bold uppercase mb-5">
            {children}
        </p>
        </>
     );
}
 
export default ErrorMessage;