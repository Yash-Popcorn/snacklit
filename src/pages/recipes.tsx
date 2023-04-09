import { Card, Grid, Image, Loading, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase';
import { useSession } from "next-auth/react";
import Nav from "@/components/Nav";

interface item {
    information: string
    image: string
}
const pb = new PocketBase('https://losaltos-hacks.pockethost.io');
const file_redirect = "https://losaltos-hacks.pockethost.io/api/files/aunw3lm5y9z4fks/"

export default function Recipes() {
    
    const {data} = useSession()
    const [information, setInformation] = useState<Array<item>>(new Array<item>())
    const [loaded, setLoaded] = useState(false)

    const handleLoad = async () => {
        try {
            const records = await pb.collection('recipes').getFullList({
                sort: '-created',
            })
            const info = new Array<item>()
            records.map((record, i) => {
                if (record.email === data?.user?.email) {
                    info.push({
                        information: record.information,
                        image: `${file_redirect}${record.id}/${record.image}`
                    })
                }
            })
            setInformation(info)
            setLoaded(true)
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        handleLoad()
    }, [])

    if (data === null || !loaded) {
        return (
            <Loading>
                Fetching your data
            </Loading>
        )
    }

    return (
        <div>
            <Nav/>
            <Grid.Container gap={2} justify="center" wrap="wrap">
                {
                    information.map((v, i)=> {
                        return (
                            <Grid xs={4} sm={3} key={i}>
                                <Card isHoverable>
                                    <Card.Header>
                                        {`Item ${i + 1}`}
                                    </Card.Header>
                                    <Card.Body>
                                        {v.information}
                                    </Card.Body>
                                    <Image
                                        showSkeleton
                                        src={v.image}
                                        width={800}
                                        height={490 * .5}
                                    />
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid.Container>
        </div>
    )
}