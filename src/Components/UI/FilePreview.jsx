import { LINE, PANEL } from '../../Utils/UIElements';

function FilePreview({files, removeFile}) {
  return (
    <>{files.length > 0 && (
            <div
              className="
                  mb-2 flex flex-wrap
                  gap-1.5
                "
            >
              {files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => removeFile(file.name)}
                  className={`
                      rounded-full border
                      px-3 py-1
                      text-[13px]
                      ${PANEL}
                      ${LINE}
                    `}
                  title="Remove file"
                >
                  {file.name}
                </button>
              ))}
            </div>
          )}</>
  )
}

export default FilePreview