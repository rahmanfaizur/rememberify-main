import { generateSharableLink } from "./shareUtils"

export async function AlertBox() {
    const { shareUrl } =  await generateSharableLink();
    return (
        <div>
            ${shareUrl}
        </div>
    )
}