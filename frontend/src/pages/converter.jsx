import FileUpload from "../components/ui/FileUpload"



function Converter() {

    const handleFileUpload = (files) => {
        console.log(files);
        // Process the files here
    };


    return (
      <>
        <h1 className="text-4xl font-bold dark:text-white" >Convert Your Video and Images</h1>
          <FileUpload onFileUpload={handleFileUpload}/>
      </>
    )
  }
  
  export default Converter
  