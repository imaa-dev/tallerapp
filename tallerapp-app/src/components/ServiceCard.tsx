import { Image, Text, TouchableOpacity } from "react-native";

export const ServiceCard = ({ service }) => {
    return(
        <TouchableOpacity>
            <Image 
                source={{
                    uri: service.file?.[0]?.path
                    ? `${service.file[0].path}`
                    : "via"
                }}
                className="w-full h-40 rounden-xl mb-2"
                resizeMode="cover"
            />
            <Text className="font-bold" >
                {service.client.name}
            </Text>
            <Text className="text-gray-500" >
                {service.product.name} - {service.product.brand}
            </Text>
            <Text className="text-blue-500" >
                {service.uuid}
            </Text>
        </TouchableOpacity>
    );
}