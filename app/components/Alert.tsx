export default function Alert({ message, type }:{message:string,type:string}) {
    const baseStyles = "px-4 py-3 rounded-md text-sm font-medium";
    let typeStyles = "";

    switch (type) {
        case "success":
            typeStyles = "bg-green-100 text-green-800 border border-green-300";
            break;
        case "error":
            typeStyles = "bg-red-100 text-red-800 border border-red-300";
            break;
        case "warning":
            typeStyles = "bg-yellow-100 text-yellow-800 border border-yellow-300";
            break;
        case "info":
            typeStyles = "bg-blue-100 text-blue-800 border border-blue-300";
            break;
        default:
            typeStyles = "bg-gray-100 text-gray-800 border border-gray-300";
    }

    return (
        <div className={`${baseStyles} ${typeStyles}`}>
            {message}
        </div>
    );
}
