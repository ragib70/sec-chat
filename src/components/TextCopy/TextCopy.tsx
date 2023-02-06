import { FC, useEffect, useState } from "react";

interface TextCopyProps{
    text: string;
    bsIcon?: string;
    title?: string;
}

const TextCopy: FC<TextCopyProps> = (props) => {
    const [copied, setCopied] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
    const [title, setTitle] = useState(props.title || 'Copy text');
    useEffect(()=>{
        if (timer) clearTimeout(timer);
        if (copied){
            setTimer(setTimeout(()=>{
                setCopied(false);
            }, 5000))
        }else{
            setTimer(undefined);
        }
    }, [copied])
    return (
        <div
            title={title}
            onMouseEnter={()=>{
                setTitle(props.title || 'Copy text');
            }}
        >
            <button className="rounded-pill px-2 bg-thm border cursor-pointer"
                onClick={()=>{
                    navigator.clipboard.writeText(props.text);
                    setCopied(true);
                    setTitle('Copied')
                }}
            >
                <i className={`bi bi-${copied ? 'check': (props.bsIcon || 'clipboard')} f-70  text-white`}></i>
            </button>
            
        </div>
    )
}

export default TextCopy;